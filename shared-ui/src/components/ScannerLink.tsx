import { PublicKey } from "@solana/web3.js";
import { useCluster } from "../contexts";
import React from "react";
import { HiMagnifyingGlassCircle } from "react-icons/hi2";
export const ScannerLink = ({ mintId }: { mintId: PublicKey }) => {
  const {cluster: networkConfiguration } = useCluster()
  return (
    <>
      <a href={`https://libreplex.io/scanner?mintId=${mintId.toBase58()}&env=${networkConfiguration}`} target="_blank">
        <HiMagnifyingGlassCircle />
      </a>
    </>
  );
};
