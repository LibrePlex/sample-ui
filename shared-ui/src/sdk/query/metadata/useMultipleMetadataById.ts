import { Connection, PublicKey } from "@solana/web3.js";
import { useContext, useMemo } from "react";
import { MetadataProgramContext } from "../../../anchor";
import { decodeMetadata } from "./metadata";
import { useMultipleAccountsById } from "./useMultipleAccountsById";

export const useMultipleMetadataById = (
  metadataIds: PublicKey[],
  connection: Connection
) => {
  const { program } = useContext(MetadataProgramContext);

  const decoder = useMemo(() => decodeMetadata(program), [program]);
//   console.log()
  return useMultipleAccountsById(metadataIds, connection, decoder);
};
