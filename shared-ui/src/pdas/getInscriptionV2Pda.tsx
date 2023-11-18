import { PublicKey } from "@solana/web3.js";

import { INSCRIPTION_V2 } from "./constants";
import { PROGRAM_ID_INSCRIPTIONS } from "../anchor";


export const getInscriptionV2Pda = (mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(INSCRIPTION_V2), mint.toBuffer()],
    new PublicKey(PROGRAM_ID_INSCRIPTIONS)
  );
};
