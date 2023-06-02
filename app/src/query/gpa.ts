import { Idl, Program } from "@coral-xyz/anchor";
import {
  Connection,
  GetProgramAccountsFilter,
  KeyedAccountInfo,
  ProgramAccountChangeCallback,
  PublicKey,
} from "@solana/web3.js";
import { IRpcObject } from "components/executor/IRpcObject";
import useQueryContext from "hooks/useQueryContext";

import { useCallback, useEffect, useMemo, useState } from "react";
import { QueryClient, useQuery, useQueryClient } from "react-query";
import { DecodeType } from "./multiAccountInfo";



const accountUpdater = <T extends unknown, P extends Idl>(decode: DecodeType<T, P>, 
  queryClient: QueryClient, key: any) =>
  (accountInfo: KeyedAccountInfo)=> {
    console.log({ queryClient });
    console.log("Account updated", accountInfo);

    const newOrUpdatedItem = decode(
      accountInfo.accountInfo.data,
      accountInfo.accountId
    );
    console.log({key})
    
    queryClient.setQueryData(key, (old: IRpcObject<T>[]) => {
      const found = (old ?? []).find((item) =>
        item.pubkey.equals(accountInfo.accountId)
      );
      console.log({ found, old });
      return found
        ? old.map((item) =>
            item.pubkey.equals(accountInfo.accountId) ? newOrUpdatedItem : item
          )
        : [...(old ?? []), newOrUpdatedItem];
    });
  }


export const fetchGpa = <T extends unknown, P extends Idl>(
  filters: GetProgramAccountsFilter[] | null,
  connection: Connection,
  decode: (buf: Buffer, pubkey: PublicKey) => IRpcObject<T>
) => ({
  getFetcher: (programId: PublicKey) => async () => {
    const _items: IRpcObject<T>[] = [];
    if (filters) {
      const results = await connection.getProgramAccounts(programId, {
        filters,
      });

      for (const result of results.values()) {
        const obj = decode(result.account.data, result.pubkey);

        _items.push(obj);
      }
    }
    return _items;
  },
  listener: {
    add: (onAccountChange: ProgramAccountChangeCallback, programId: PublicKey) =>
      connection.onProgramAccountChange(
        programId,
        onAccountChange,
        "processed",
        filters
      ),
    remove: (i: number) => {
      connection.removeProgramAccountChangeListener(i);
    },
  },
});

export const useGpa = <T extends unknown, P extends Idl>(
  programId: PublicKey,
  filters: GetProgramAccountsFilter[] | null,
  connection: Connection,
  decode: DecodeType<T, P>,
  key: any
) => {
  const { getFetcher, listener } = useMemo(
    () => fetchGpa(filters, connection, decode),

    [filters, connection, decode]
  );


    
  const queryClient = useQueryClient();

  const fetcher = useMemo(
    () =>
      getFetcher && programId
        ? { key, fetcher: getFetcher(programId) }
        : { key: "DUMMY", fetcher: () => [] },
    [getFetcher, programId, key]
  );

  // useEffect(()=>{
  //   console.log({fetcherKey: fetcher.key});
  // },[fetcher.key])

  const q = useQuery<IRpcObject<T>[]>(fetcher.key, fetcher.fetcher);


  /// intercept account changes and refetch as needed
  useEffect(() => {
    let i: any;
    if (programId) {
      i = listener.add(accountUpdater(decode,  
        queryClient, fetcher.key), programId);
    }
    return () => {
      if (i !== undefined) {
        listener.remove(i);
      }
    };
  }, [listener, programId, decode, queryClient, fetcher.key]);

  return q
};
