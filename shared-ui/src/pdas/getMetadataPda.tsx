import { PublicKey } from "@solana/web3.js";

import { METADATA } from "./constants";


export const getMetadataPda = (programId: PublicKey, mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(METADATA), mint.toBuffer()],
    new PublicKey(programId)
  );
};
