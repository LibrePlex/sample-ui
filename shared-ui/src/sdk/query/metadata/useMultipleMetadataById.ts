import { IRpcObject } from "./../../../components/executor/IRpcObject";
import { Connection, PublicKey } from "@solana/web3.js";
import { useContext, useEffect, useMemo } from "react";
import { MetadataProgramContext } from "../../../anchor";
import { Metadata, decodeMetadata } from "./metadata";
import { useMultipleAccountsById } from "./useMultipleAccountsById";

export const useMultipleMetadataById = (
  metadataIds: PublicKey[],
  connection: Connection
) => {
  const { program } = useContext(MetadataProgramContext);

  const decoder = useMemo(() => decodeMetadata(program), [program]);
  const results = useMultipleAccountsById(metadataIds, connection);
  const decodedMetadata = useMemo(() => {
    //  console.log({ result, orderedIds });

    const _groups: IRpcObject<Metadata>[] = [];
    for (const res of results.data) {
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
  }, [decoder, results]);

  return { ...results, data: decodedMetadata };
};
