import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";

import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Deployment, IRpcObject } from "@libreplex/shared-ui";
import {  DEPLOYMENT_TYPE_HYBRID, DEPLOYMENT_TYPE_2022 } from "./MintTransactionButton";

export const getFungibleTokenProgramForDeployment = (
  deployment: IRpcObject<Deployment>
) =>
  deployment?.item?.deploymentType === DEPLOYMENT_TYPE_2022
    ? TOKEN_2022_PROGRAM_ID
    : TOKEN_PROGRAM_ID;

export const getNonFungibleTokenProgramForDeployment = (
  deployment: IRpcObject<Deployment>
) =>
  deployment?.item?.deploymentType === DEPLOYMENT_TYPE_2022 ||
  deployment?.item?.deploymentType === DEPLOYMENT_TYPE_HYBRID
    ? TOKEN_2022_PROGRAM_ID
    : TOKEN_PROGRAM_ID;

export const getTokenProgramsForDeployment = (
  deployment: IRpcObject<Deployment>
) => {
  return {
    fungible: getFungibleTokenProgramForDeployment(deployment),
    nonFungible: getNonFungibleTokenProgramForDeployment(deployment),
  };
};

export const useTokenProgramsForDeployment = (
  deployment: IRpcObject<Deployment>
) => {
  return useMemo(() => getTokenProgramsForDeployment(deployment), [deployment]);
};
