import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { IRpcObject } from "../../../components";
import { BufferingConnection } from "../../../stores";
import { sha256 } from "js-sha256";
import bs58 from "bs58";

enum Status {
  Ready,
  Loading,
  Loaded,
}

const calculateHash = (ids: PublicKey[]) => {
  let currentHash = "";
  for( const id of ids) {
    currentHash = bs58.encode(sha256.array(`${currentHash}${id.toBase58()}`).slice(0, 8))
  }
  return currentHash
  
}

export const useMultipleAccountsById = <T extends unknown>(
  ids: PublicKey[],
  connection: Connection,
  decoder: (buf: Buffer, key: PublicKey) => IRpcObject<T>
) => {
  const [objects, setObjects] = useState<IRpcObject<T>[]>([]);

  const orderedIds = useMemo(
    () =>
      [...ids].sort((a, b) => a.toBase58().localeCompare(b.toBase58())),
    [ids]
  );


  const [hash, setHash] = useState<string>('');

  useEffect(()=>{
    const _newHash = calculateHash(orderedIds);
    if( hash !== _newHash) {
      setStatus(Status.Ready);
      setHash(_newHash)
    }
  },[hash, orderedIds])


  const [status, setStatus] = useState<Status>(Status.Ready);

  const [isFetching, setIsFetching] = useState<boolean>(false);
  useEffect(() => {
    let active = true;
    (async () => {
      if (status === Status.Ready) {
        setStatus(Status.Loading);
        setIsFetching(true);
        console.log('Fetching');
        const bufferingConnection = BufferingConnection.getOrCreate(connection);
        const result = await bufferingConnection.getMultipleAccountsInfo(
          orderedIds
        );
        console.log({result, orderedIds});

        const _groups: IRpcObject<T>[] = [];
        for (const res of result.values() ?? []) {
          if (res.data) {
            const parsedObj = decoder(res.data, res.accountId);
            if (parsedObj.item) {
              _groups.push({ ...parsedObj, item: parsedObj.item! });
            }
          }
        }
        setObjects(_groups);
         setIsFetching(false);
         setStatus(Status.Loaded);
      }
    })();
    
  }, [connection, orderedIds, status]);
  useEffect(()=>{
    console.log({connection, orderedIds, status});
  },[connection, orderedIds, status])

  return { isFetching, data: objects };
};
