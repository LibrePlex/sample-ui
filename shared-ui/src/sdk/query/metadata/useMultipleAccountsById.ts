import { useQuery } from "react-query";
import { Connection, PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  for (const id of ids) {
    currentHash = bs58.encode(
      sha256.array(`${currentHash}${id.toBase58()}`).slice(0, 8)
    );
  }
  return currentHash;
};

export const useMultipleAccountsById = (
  ids: PublicKey[],
  connection: Connection
) => {
  const [objects, setObjects] = useState<
    { accountId: PublicKey; data: Buffer; balance: bigint }[]
  >([]);

  const orderedIds = useMemo(
    () => [...ids].sort((a, b) => a.toBase58().localeCompare(b.toBase58())),
    [ids]
  );

  // const [hash, setHash] = useState<string>("");

  const [status, setStatus] = useState<{
    status: Status;
    hash: string;
    orderedIds: PublicKey[];
  }>({
    status: Status.Loaded,
    hash: "",
    orderedIds: [],
  });

  const hash = useMemo(
    () => (connection.rpcEndpoint ? calculateHash(orderedIds) : ""),
    [orderedIds, connection]
  );

  // const resetStatus = useCallback(() => {
  //   setStatus({ status: Status.Ready, hash, orderedIds });
  // }, [hash, orderedIds]);

  // useEffect(() => {
  //   resetStatus();
  // }, [hash]);

  // useEffect(() => {
  //   setStatus(old=>({ ...old, status: Status.Ready}));
  // }, [connection]);

  // const [isFetching, setIsFetching] = useState<boolean>(false);
  const refreshData = useCallback(async () => {
    console.log("Fetching");
    const bufferingConnection = BufferingConnection.getOrCreate(connection);
    const result = await bufferingConnection.getMultipleAccountsInfo(
      status.orderedIds
    );
    return [...result.values()]
  }, [status]);

  useEffect(() => {
    refreshData();
  }, [status, connection]);

  const q = useQuery<{ accountId: PublicKey; data: Buffer; balance: bigint; }[]>(hash, refreshData, {
    refetchOnMount: false,
  });

  return { isFetching: status.status === Status.Loading, data: q?.data || [] };
};
