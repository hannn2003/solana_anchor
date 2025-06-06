import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Project01 } from "../target/types/project01";
import { assert } from "chai";

describe("project01", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.project01 as Program<Project01>;

  // create key pair for owner
  const owner = "FMeR43MSM64gjztwqWQSHc8hCYj82GrVTfwFzfcv9UHU";

  const authority = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(require("/home/dmin/.config/solana/id.json"))
  );

  const user = anchor.web3.Keypair.generate();
  const operator = anchor.web3.Keypair.generate();

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

  describe("Configuration", () => {
    it("Should initialize successfully", async () => {
      await program.methods.initialize().rpc();

      const configInfo = await program.account.config.fetch(configAccount);
      console.log("configInfo", configInfo);
      assert.equal(configInfo.owner.toBase58(), owner);
      assert.equal(configInfo.creator.toBase58(), owner);
    });
  });
});
