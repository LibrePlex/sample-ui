import { PublicKey } from "@solana/web3.js";

import { INSCRIPTION_DATA } from "./constants";
import { PROGRAM_ID_INSCRIPTIONS } from "../anchor";


export const getInscriptionDataPda = (mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(INSCRIPTION_DATA),mint.toBuffer()],
    new PublicKey(PROGRAM_ID_INSCRIPTIONS)
  );
};
