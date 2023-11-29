import { toBufferLE } from "bigint-buffer";
import { PublicKey } from '@solana/web3.js';
import { PROGRAM_ID_FAIR_LAUNCH } from "../constants";

const DEPLOYMENT = "deployment";

export const getDeploymentPda = (ticker: String) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(DEPLOYMENT), Buffer.from(ticker)],
    new PublicKey(PROGRAM_ID_FAIR_LAUNCH)
  );
};
