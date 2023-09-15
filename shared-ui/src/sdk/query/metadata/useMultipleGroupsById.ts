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
  const results = useMultipleAccountsById(groupIds, connection)
  const decodedGroups = useMemo(()=>{
    //  console.log({ result, orderedIds });

        const _groups: IRpcObject<Group>[] = [];
        for (const res of results.data ) {
          if (res.data) {
            try {
              const parsedObj = decoder(res.data, res.accountId);
              if (parsedObj.item) {
                _groups.push({ ...parsedObj, item: parsedObj.item! });
              }
            } catch (e) {
              console.log({ e });
            }
          }
        }
        return _groups;
  },[decoder, results])
  return {...results, data: decodedGroups};

  
};
