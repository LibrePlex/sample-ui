import { PublicKey } from "@solana/web3.js";

import { METADATA_EXTENDED } from "./constants";
import { PROGRAM_ID } from "anchor/getProgramInstance";

export const getMetadataExtendedPda = (mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(METADATA_EXTENDED), mint.toBuffer()],
    new PublicKey(PROGRAM_ID)
  );
};
