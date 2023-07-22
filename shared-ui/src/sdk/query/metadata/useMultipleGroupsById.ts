import { IRpcObject } from "../../../components";
import { BufferingConnection } from "../../../stores";
import { useContext, useEffect, useMemo, useState } from "react";
import { Metadata, decodeMetadata } from "./metadata";
import { Connection, PublicKey } from "@solana/web3.js";
import { MetadataProgramContext} from "../../../anchor";
import { Group, decodeGroup } from "./group";
import { useMultipleAccountsById } from "./useMultipleAccountsById";

export const useMultipleGroupsById = (
  groupIds: PublicKey[],
  connection: Connection
) => {
  const { program } = useContext(MetadataProgramContext);

  const decoder = useMemo(()=>decodeGroup(program), [program])
  return  useMultipleAccountsById(groupIds, connection, decoder)
  
};
