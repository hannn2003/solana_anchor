import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Project01 } from "../target/types/project01";
import { assert } from "chai";

describe("project01", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.project01 as Program<Project01>;

  // create key pair for owner
  const owner = anchor.web3.Keypair.generate();
  const creator = anchor.web3.Keypair.generate();
  const authority = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(require("/home/dmin/.config/solana/id.json"))
  );
  const user = anchor.web3.Keypair.generate();
  const operator = anchor.web3.Keypair.generate();

  const poolAccount = anchor.web3.Keypair.generate();

  before(async () => {
    const provider = anchor.AnchorProvider.env();
    const latestBlockHash = await provider.connection.getLatestBlockhash();

    await Promise.all(
      [user, operator].map(async (account) => {
        const airdropSignature = await provider.connection.requestAirdrop(
          account.publicKey,
          1_000 * 1e9
        );

        await provider.connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: airdropSignature,
        });
      })
    );
  });

  const configAccount = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("ido_platform_seed")],
    program.programId
  )[0];

  const poolAccountPDA = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("ido_platform_pool_seed")],
    program.programId
  )[0];

  describe("Configuration", () => {
    it("Should initialize successfully", async () => {
      await program.methods
        .initialize(owner.publicKey, creator.publicKey)
        .rpc();

      const configInfo = await program.account.config.fetch(configAccount);
      console.log("configInfo", configInfo);
      assert.equal(configInfo.owner.toBase58(), owner.publicKey.toBase58());
      assert.equal(configInfo.creator.toBase58(), creator.publicKey.toBase58());
    });
  });

  describe("Create Pool", () => {
    it("Should create pool successfully", async () => {
      console.log("poolAccountPDA", poolAccountPDA);
      const startTime = new anchor.BN(Date.now() / 1000);
      const rewardTime = new anchor.BN(5 * 60);
      const rewardPerPeriod = new anchor.BN(1);

      await program.methods
        .createPool(startTime, rewardTime, rewardPerPeriod)
        .rpc();

      const poolInfo = await program.account.pool.fetch(poolAccountPDA);
      console.log("poolInfo", poolInfo);
      
      assert.equal(poolInfo.startTime.toString(), startTime.toString());
      assert.equal(poolInfo.rewardTime.toString(), rewardTime.toString());
      assert.equal(
        poolInfo.rewardPerPeriod.toString(),
        rewardPerPeriod.toString()
      );
      assert.equal(poolInfo.stakedAmount.toString(), "0");
    });
  });
});
