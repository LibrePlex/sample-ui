import { PublicKey } from "@solana/web3.js";

import { INSCRIPTION } from "./constants";
import { PROGRAM_ID_INSCRIPTIONS } from "../anchor";

export const getInscriptionPda = (mint: PublicKey | undefined) => {
  return mint
    ? PublicKey.findProgramAddressSync(
        [Buffer.from(INSCRIPTION), mint.toBuffer()],
        new PublicKey(PROGRAM_ID_INSCRIPTIONS)
      )
    : [undefined];
};
