
import { PublicKey } from "@solana/web3.js";

import { COLLECTION } from "./constants";
import { PROGRAM_ID_METADATA } from "../anchor/metadata/getProgramInstanceMetadata";


export const getGroupPda = (seed: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(COLLECTION), seed.toBuffer()],
    new PublicKey(PROGRAM_ID_METADATA)
  );
};
