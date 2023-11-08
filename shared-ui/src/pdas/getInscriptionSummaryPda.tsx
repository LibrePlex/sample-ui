import { PublicKey } from "@solana/web3.js";

import { INSCRIPTION_SUMMARY } from "./constants";
import { PROGRAM_ID_INSCRIPTIONS } from "../anchor";


export const getInscriptionSummaryPda = () => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(INSCRIPTION_SUMMARY)],
    new PublicKey(PROGRAM_ID_INSCRIPTIONS)
  );
};
