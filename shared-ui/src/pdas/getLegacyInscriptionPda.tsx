import { toBufferLE } from "bigint-buffer";
import { PublicKey } from "@solana/web3.js";

import { LEGACY_INSCRIPTION, PROGRAM_ID_LEGACY_INSCRIPTION } from "./constants";


export const getLegacyInscriptionPda = (mint: PublicKey) => {
  return mint ? PublicKey.findProgramAddressSync(
    [Buffer.from(LEGACY_INSCRIPTION),mint.toBuffer()],
    new PublicKey(PROGRAM_ID_LEGACY_INSCRIPTION)
  )[0]: undefined;
};
