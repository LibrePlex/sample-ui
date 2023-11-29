import { PublicKey } from "@solana/web3.js";
import { HASHLIST, PROGRAM_ID_FAIR_LAUNCH } from "../constants";


export const getHashlistPda = (deployment: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(HASHLIST), deployment.toBuffer()],
    new PublicKey(PROGRAM_ID_FAIR_LAUNCH)
  );
};
