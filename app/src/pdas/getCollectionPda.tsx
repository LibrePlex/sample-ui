
import { PublicKey } from "@solana/web3.js";

import { COLLECTION } from "./constants";
import { PROGRAM_ID } from "anchor/getProgramInstance";

export const getCollectionPda = (seed: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(COLLECTION), seed.toBuffer()],
    new PublicKey(PROGRAM_ID)
  );
};
