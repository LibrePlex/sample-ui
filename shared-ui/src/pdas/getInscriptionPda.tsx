import { PublicKey } from "@solana/web3.js";

import { INSCRIPTION } from "./constants";


export const getInscriptionPda = (programId: PublicKey, mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(INSCRIPTION), mint.toBuffer()],
    new PublicKey(programId)
  );
};
