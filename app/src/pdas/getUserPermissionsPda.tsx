import { PublicKey } from "@solana/web3.js";

import { PERMISSIONS } from "./constants";
import { PROGRAM_ID } from "anchor/getProgramInstance";

export const getUserPermissionsPda = (collection: PublicKey, authority: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(PERMISSIONS), collection.toBuffer(), authority.toBuffer()],
    new PublicKey(PROGRAM_ID)
  );
};
