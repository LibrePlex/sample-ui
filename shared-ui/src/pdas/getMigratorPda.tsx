import { PublicKey } from "@solana/web3.js";

import { MIGRATOR } from "./constants";
import { PROGRAM_ID_INSCRIPTIONS } from "../anchor";

export const getMigratorPda = (mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(MIGRATOR), mint.toBuffer()],
    new PublicKey(PROGRAM_ID_INSCRIPTIONS)
  );
};
