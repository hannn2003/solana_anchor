import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Project01 } from "../target/types/project01";
import { assert } from "chai";
import moment from "moment";
const sleep = (seconds) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

describe("project01", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.env();

  const program = anchor.workspace.project01 as Program<Project01>;

  // create key pair for owner
  const owner = anchor.web3.Keypair.generate();
  const creator = anchor.web3.Keypair.generate();
  console.log("creator", creator.publicKey);
  const configAccount = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("ido_platform_seed")],
    program.programId
  )[0];

  const poolAccountPDA = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("ido_platform_pool_seed")],
    program.programId
  )[0];

  before(async () => {
    await Promise.all(
      [owner.publicKey, creator.publicKey].map(async (address) => {
        try {
          const airdropSignature = await provider.connection.requestAirdrop(
            address,
            5 * 10 ** 9
          );
          const latestBlockHash =
            await provider.connection.getLatestBlockhash();

          await provider.connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: airdropSignature,
          });

          console.log(`Airdrop successful for address: ${address.toBase58()}`);
        } catch (error) {
          console.error(
            `Airdrop failed for address: ${address.toBase58()}`,
            error
          );
        }
      })
    );
  });

  function convertToBN(value: number | string): anchor.BN {
    return new anchor.BN(value);
  }

  function getTimeAfterSecond(secondsToAdd: number) {
    return Math.floor(moment().add(secondsToAdd, "seconds").valueOf() / 1000);
  }

  // initialize
  describe("Configuration", () => {
    it("Should initialize successfully", async () => {
      const init_tx = await program.methods
        .initialize(owner.publicKey, creator.publicKey)
        .rpc();

      console.log("init_tx", init_tx);

      const configInfo = await program.account.config.fetch(configAccount);
      assert.equal(configInfo.owner.toBase58(), owner.publicKey.toBase58());
      assert.equal(configInfo.creator.toBase58(), creator.publicKey.toBase58());

      await sleep(1);
      const parsedTransaction = await provider.connection.getParsedTransaction(
        init_tx,
        {
          maxSupportedTransactionVersion: 0,
          commitment: "confirmed",
        }
      );
      console.log(parsedTransaction.meta.logMessages);
    });
  });

  // create pool
  const startTime = getTimeAfterSecond(10);
  const endTime = getTimeAfterSecond(50);
  const claimTime = getTimeAfterSecond(50);
  const currency = anchor.web3.Keypair.generate();
  const token = anchor.web3.Keypair.generate();
  const signer = anchor.web3.Keypair.generate();
  const tokensForSale = 1_000_000;
  const tokenDecimnals = 6;
  const tokenRate = 1;
  const decimals = 3;

  describe("Create Pool", () => {
    it("Should revert if create pool by account is not a creator", () => {
      try {
        program.methods
          .createPool(
            convertToBN(startTime),
            convertToBN(endTime),
            convertToBN(claimTime),
            convertToBN(tokensForSale).mul(
              convertToBN(10).pow(convertToBN(tokenDecimnals))
            ),
            tokenDecimnals,
            convertToBN(tokenRate).mul(
              convertToBN(10).pow(convertToBN(decimals))
            ),
            decimals,
            currency.publicKey,
            token.publicKey,
            signer.publicKey
          )
          .accounts({ signer: owner.publicKey })
          .signers([owner])
          .rpc();
        assert.fail("Should revert but it didn't");
      } catch (error) {
        console.log(error);
        assert.equal(error.error.errorCode.code, "Unauthorized");
        assert.equal(error.error.errorMessage, "Unauthorized");
      }
    });

    it("Should revert if end_time is not greater than start_time", () => {
      const invalidEndTime = getTimeAfterSecond(1);

      try {
        program.methods
          .createPool(
            convertToBN(startTime),
            convertToBN(invalidEndTime),
            convertToBN(claimTime),
            convertToBN(tokensForSale).mul(
              convertToBN(10).pow(convertToBN(tokenDecimnals))
            ),
            tokenDecimnals,
            convertToBN(tokenRate).mul(
              convertToBN(10).pow(convertToBN(decimals))
            ),
            decimals,
            currency.publicKey,
            token.publicKey,
            signer.publicKey
          )
          .accounts({ signer: creator.publicKey })
          .signers([creator])
          .rpc();
        assert.fail("Should revert due to invalid end_time");
      } catch (error) {
        console.log("error", error);
        assert.equal(error.error.errorCode.code, "InvalidTimePeriod");
      }
    });

    it("Should revert if token rate is invalid", () => {
      const invalidTokenRate = 0;

      try {
        program.methods
          .createPool(
            convertToBN(startTime),
            convertToBN(endTime),
            convertToBN(claimTime),
            convertToBN(tokensForSale).mul(
              convertToBN(10).pow(convertToBN(tokenDecimnals))
            ),
            tokenDecimnals,
            convertToBN(invalidTokenRate).mul(
              convertToBN(10).pow(convertToBN(decimals))
            ),
            decimals,
            currency.publicKey,
            token.publicKey,
            signer.publicKey
          )
          .accounts({ signer: creator.publicKey })
          .signers([creator])
          .rpc();
        assert.fail("Should revert due to invalid token rate");
      } catch (error) {
        console.log("error", error);
        assert.equal(error.error.errorCode.code, "InvalidTokenRate");
      }
    });

    it("Should create pool successfully", async () => {
      await program.methods
        .createPool(
          convertToBN(startTime),
          convertToBN(endTime),
          convertToBN(claimTime),
          convertToBN(tokensForSale).mul(
            convertToBN(10).pow(convertToBN(tokenDecimnals))
          ),
          tokenDecimnals,
          convertToBN(tokenRate).mul(
            convertToBN(10).pow(convertToBN(decimals))
          ),
          decimals,
          currency.publicKey,
          token.publicKey,
          signer.publicKey
        )
        .accounts({ signer: creator.publicKey })
        .signers([creator])
        .rpc();

      const poolInfo = await program.account.config.fetch(poolAccountPDA);
      console.log("poolInfo", poolInfo);
      // assert.equal(
      //   poolInfo.startTime.toString(),
      //   convertToBN(startTime).toString()
      // );
      // assert.equal(
      //   poolInfo.endTime.toString(),
      //   convertToBN(endTime).toString()
      // );
      // assert.equal(
      //   poolInfo.tokenForSale.toString(),
      //   convertToBN(tokensForSale).toString()
      // );
      // assert.equal(
      //   poolInfo.tokenRate.toString(),
      //   convertToBN(tokenRate).toString()
      // );
    });
  });
});
