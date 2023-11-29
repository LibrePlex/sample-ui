import { PublicKey } from "@solana/web3.js";
import { HASHLIST_MARKER, PROGRAM_ID_FAIR_LAUNCH } from "../constants";


export const getHashlistMarkerPda = (deployment: PublicKey, mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(HASHLIST_MARKER), deployment.toBuffer(), mint.toBuffer()],
    new PublicKey(PROGRAM_ID_FAIR_LAUNCH)
  );
};
