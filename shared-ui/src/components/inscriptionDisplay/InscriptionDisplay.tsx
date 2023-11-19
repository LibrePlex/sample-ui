import { PublicKey } from "@solana/web3.js";
import { useInscriptionDataForRoot, useInscriptionForRoot } from "../../sdk";
import {VStack} from "@chakra-ui/react"
import React from "react";
import { InscriptionTable } from "./InscriptionTable";
import { TensorButton } from "../migration/TensorButton";

export const InscriptionDisplay = ({ mintId }: { mintId: PublicKey }) => {
  
  // const {
  //   data: compressedImage,
  //   refetch: refetchOffchainData,
  //   isFetching: isFetchingOffchainData,
  // } = useLegacyCompressedImage(mintId, false);

  return (
    <VStack>
      
      <InscriptionTable mint={mintId}></InscriptionTable>
    </VStack>
  );
};
