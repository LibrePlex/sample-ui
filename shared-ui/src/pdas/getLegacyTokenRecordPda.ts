import { PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";

export const getLegacyTokenRecordPda = (mintId: PublicKey, tokenAccountId: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      new PublicKey(PROGRAM_ID).toBuffer(),
      mintId.toBuffer(),
      Buffer.from("token_record"),
      tokenAccountId.toBuffer(),
    ],

    new PublicKey(PROGRAM_ID)
  );
};
