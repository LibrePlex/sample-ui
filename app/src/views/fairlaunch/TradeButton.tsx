import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    HStack,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    VStack,
  } from "@chakra-ui/react";
  import { useConnection } from "@solana/wallet-adapter-react";
  import { PublicKey } from "@solana/web3.js";
  import { useEffect, useMemo, useState } from "react";
  import { useTokenProgramForDeployment } from "./useTokenProgramForDeployment";
  
  import Link from "next/link";
import { getHashlistPda, useDeploymentById, useHashlistById } from "shared-ui";
  
  export const TradeButtonSolsniper = ({
    deploymentId,
  }: {
    deploymentId: PublicKey;
  }) => {
    const hashlistId = useMemo(
      () => (deploymentId ? getHashlistPda(deploymentId)[0] : null),
      [deploymentId]
    );
    const { connection } = useConnection();
  
    const { data: deployment } = useDeploymentById(deploymentId, connection);
  
    return (
      <VStack>
        <Link href={`https://sniper.xyz/collection/${deploymentId}`}>
          <HStack>
            <Button colorScheme={"yellow"}>
              Trade {deployment?.item?.ticker}{" "}
            </Button>
            <img height="32px" width="32px" src="/sniper-icon.svg" />
          </HStack>
        </Link>
      </VStack>
    );
  };
  