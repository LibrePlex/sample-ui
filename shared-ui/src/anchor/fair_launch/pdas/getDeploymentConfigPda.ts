import { toBufferLE } from "bigint-buffer";
import { PublicKey } from '@solana/web3.js';
import { PROGRAM_ID_FAIR_LAUNCH } from "../constants";

const DEPLOYMENT_CONFIG = "deployment_config";

export const getDeploymentConfigPda = (deployment: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(DEPLOYMENT_CONFIG), deployment.toBuffer()],
    new PublicKey(PROGRAM_ID_FAIR_LAUNCH)
  );
};
