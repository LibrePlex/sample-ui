import { toBufferLE } from "bigint-buffer";
import { PublicKey } from "@solana/web3.js";

import { LEGACY_INSCRIPTION } from "./constants";


export const getLegacyInscriptionPda = (programId: PublicKey, mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(LEGACY_INSCRIPTION),mint.toBuffer()],
    new PublicKey(programId)
  );
};
