import { PublicKey } from "@solana/web3.js";

import { PERMISSIONS } from "./constants";
import { PROGRAM_ID_METADATA } from "../anchor/metadata/getProgramInstanceMetadata";


export const getPermissionsPda = (reference: PublicKey, authority: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(PERMISSIONS), reference.toBuffer(), authority.toBuffer()],
    new PublicKey(PROGRAM_ID_METADATA)
  );
};
