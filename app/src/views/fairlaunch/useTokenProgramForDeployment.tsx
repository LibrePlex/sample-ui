import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { Deployment, IRpcObject } from "shared-ui/src";
import { DEPLOYMENT_TYPE_2022 } from "./MintTransactionButton";
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const getTokenProgramForDeployment = (
  deployment: IRpcObject<Deployment>
) =>
  deployment?.item?.deploymentType === DEPLOYMENT_TYPE_2022
    ? TOKEN_2022_PROGRAM_ID
    : TOKEN_PROGRAM_ID;

export const useTokenProgramForDeployment = (
  deployment: IRpcObject<Deployment>
) => {
  return useMemo(
    () => getTokenProgramForDeployment(deployment),
    [deployment]
  );
};
