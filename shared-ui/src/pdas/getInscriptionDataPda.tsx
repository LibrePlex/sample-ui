import { PublicKey } from "@solana/web3.js";

import { INSCRIPTION_DATA } from "./constants";


export const getInscriptionDataPda = (programId: PublicKey, mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(INSCRIPTION_DATA),mint.toBuffer()],
    new PublicKey(programId)
  );
};
