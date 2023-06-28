import { PublicKey } from "@solana/web3.js";

import { METADATA_EXTENSION } from "./constants";
import { PROGRAM_ID_METADATA } from "shared-ui";

export const getMetadataExtendedPda = (metadata: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(METADATA_EXTENSION), metadata.toBuffer()],
    new PublicKey(PROGRAM_ID_METADATA)
  );
};
