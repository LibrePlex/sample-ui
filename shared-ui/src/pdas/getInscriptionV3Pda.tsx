import { PublicKey } from "@solana/web3.js";

import { INSCRIPTION_V3 } from "./constants";
import { PROGRAM_ID_INSCRIPTIONS } from "../anchor";


export const getInscriptionV3Pda = (mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(INSCRIPTION_V3), mint.toBuffer()],
    new PublicKey(PROGRAM_ID_INSCRIPTIONS)
  );
};
