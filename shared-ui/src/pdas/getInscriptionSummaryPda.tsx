import { PublicKey } from "@solana/web3.js";

import { INSCRIPTION_SUMMARY } from "./constants";


export const getInscriptionSummaryPda = (programId: PublicKey, mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(INSCRIPTION_SUMMARY),mint.toBuffer()],
    new PublicKey(programId)
  );
};
