import { PublicKey } from "@solana/web3.js";
import { useInscriptionDataForMint, useInscriptionForMint } from "../../sdk";
import { useLegacyCompressedImage } from "../assetdisplay/useLegacyCompressedImage";
import React from "react";
import { InscriptionTable } from "./InscriptionTable";

export const InscriptionDisplay = ({ mintId }: { mintId: PublicKey }) => {
  const inscription = useInscriptionForMint(mintId);
  const inscriptionData = useInscriptionDataForMint(mintId);

  // const {
  //   data: compressedImage,
  //   refetch: refetchOffchainData,
  //   isFetching: isFetchingOffchainData,
  // } = useLegacyCompressedImage(mintId, false);

  return (
    <>
      <InscriptionTable mint={mintId}></InscriptionTable>
    </>
  );
};
