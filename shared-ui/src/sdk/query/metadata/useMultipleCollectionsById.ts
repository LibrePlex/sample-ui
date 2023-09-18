import { Connection, PublicKey } from "@solana/web3.js";
import { useContext, useMemo } from "react";
import { MetadataProgramContext } from "../../../anchor";
import { IRpcObject } from "../../../components";
import { Collection, decodeCollection } from "./collection";
import { useMultipleAccountsById } from "./useMultipleAccountsById";

export const useMultipleCollectionsById = (
  collectionIds: PublicKey[],
  connection: Connection
) => {
  const { program } = useContext(MetadataProgramContext);

  const decoder = useMemo(()=>decodeCollection(program), [program])
  const results = useMultipleAccountsById(collectionIds, connection)
  const decodedCollections = useMemo(()=>{
    //  console.log({ result, orderedIds });

        const _collections: IRpcObject<Collection>[] = [];
        for (const res of results.data ) {
          if (res.data) {
            try {
              const parsedObj = decoder(res.data, res.accountId);
              if (parsedObj.item) {
                _collections.push({ ...parsedObj, item: parsedObj.item! });
              }
            } catch (e) {
              console.log({ e });
            }
          }
        }
        return _collections;
  },[decoder, results])
  return {...results, data: decodedCollections};

  
};
