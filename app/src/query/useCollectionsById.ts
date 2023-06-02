import { useMemo } from "react";
import { fetchMultiAccounts } from "./multiAccountInfo";
import { Connection, PublicKey } from "@solana/web3.js";
import { Collection } from "generated/libreplex";
import { useQuery } from "react-query";

export const decodeCollection = (buffer: Buffer) => {
  const obj = Collection.deserialize(buffer);
  if (obj) {
    return obj[0];
  } else {
    return null;
  }
};

export const useCollectionsById = (
  collectionKeys: PublicKey[],
  connection: Connection
) => {
  const fetcher = useMemo(
    () => fetchMultiAccounts(collectionKeys, decodeCollection, connection),
    [collectionKeys, decodeCollection, connection]
  );

  
  return useQuery(
    collectionKeys,
    fetcher
  );
  
};
