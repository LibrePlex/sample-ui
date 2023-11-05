import { toBufferLE } from "bigint-buffer";
import { PublicKey } from "@solana/web3.js";

import { INSCRIPTION_RANK } from "./constants";


export const getInscriptionRankPda = (programId: PublicKey, index: bigint) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(INSCRIPTION_RANK),toBufferLE(index, 8)],
    new PublicKey(programId)
  );
};
