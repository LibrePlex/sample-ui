import { PublicKey } from "@solana/web3.js";

import { METADATA } from "./constants";
import { PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";

export const getLegacyMetadataPda = (mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(METADATA), PROGRAM_ID.toBuffer(), mint.toBuffer()],
    new PublicKey(PROGRAM_ID)
  );
};
