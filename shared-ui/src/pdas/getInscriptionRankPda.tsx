import { toBufferLE } from "bigint-buffer";
import { PublicKey } from "@solana/web3.js";

import { INSCRIPTION_RANK } from "./constants";
import { PROGRAM_ID_INSCRIPTIONS } from "../anchor";


export const getInscriptionRankPda = (index: bigint) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(INSCRIPTION_RANK),toBufferLE(index, 4)],
    new PublicKey(PROGRAM_ID_INSCRIPTIONS)
  );
};
