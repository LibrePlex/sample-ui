import { PublicKey } from "@solana/web3.js";
import { useCluster } from "../contexts";
import React from "react";
import {IconButton} from "@chakra-ui/react"
import { HiSearch } from "react-icons/hi";

export const ScannerLink = ({ mintId }: { mintId: PublicKey }) => {
  const {cluster: networkConfiguration } = useCluster()
  return (
    <>
      {/* <a href={`} target="_blank"> */}
        <IconButton aria-label="Libreplex Scanner" onClick={()=>{
          window.open(`https://libreplex.io/scanner?mintId=${mintId.toBase58()}&env=${networkConfiguration}`)
        }}>
        <HiSearch />
        </IconButton>
      {/* </a> */}
    </>
  );
};
