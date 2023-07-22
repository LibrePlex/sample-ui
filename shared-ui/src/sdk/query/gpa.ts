
import { Idl } from "@coral-xyz/anchor";
import {
  AccountInfo,
  Connection,
  GetProgramAccountsFilter,
  KeyedAccountInfo,
  ProgramAccountChangeCallback,
  PublicKey
} from "@solana/web3.js";
import { IRpcObject } from "../../components/executor/IRpcObject";

import { useEffect, useMemo } from "react";
import { QueryClient, useQuery, useQueryClient } from "react-query";
import {Updater} from "react-query/types/core/utils"



const accountUpdater = (
  queryClient: QueryClient, key: any) =>
  (accountInfo: KeyedAccountInfo)=> {
    // console.log({ queryClient });
    // console.log("Account updated", accountInfo);

    const newOrUpdatedItem = {
      item: accountInfo.accountInfo.data,
      pubkey: accountInfo.accountId
    }
    // console.log({key})

    const fn: Updater<IRpcObject<Buffer | undefined>[] | undefined,
       IRpcObject<Buffer | undefined>[] > = (old: IRpcObject<Buffer | undefined>[] | undefined ) => {
      const found = (old ?? []).find((item) =>
        item.pubkey.equals(accountInfo.accountId)
      );
      // console.log({ found, old });
      if( found ) {
        return old?.map((item) =>
            item.pubkey.equals(accountInfo.accountId) ? newOrUpdatedItem : item
          ) ?? []
      } else {
        return [...(old ?? []), newOrUpdatedItem] ?? []
      }
    };
    
    queryClient.setQueryData(key, fn);
  }


export const fetchGpa = <T extends unknown, P extends Idl>(
  filters: GetProgramAccountsFilter[] | undefined,
  connection: Connection,
  programId: PublicKey
) => ({
  fetcher: async () => {
    const _items: IRpcObject<Buffer>[] = [];
    if (filters) {
      const results = await connection?.getProgramAccounts(programId, {
        filters,
      });

      // console.log({results, filters});
;
      for (const result of results?.values()??[]) {
        // const obj = decode(result.account.data, result.pubkey);

        _items.push({
          item: result.account.data,
          pubkey: result.pubkey
        });
      }
    }
    return _items;
  },
  listener: {
    add: (onAccountChange: ProgramAccountChangeCallback, programId: PublicKey) =>
      connection?.onProgramAccountChange(
        programId,
        onAccountChange,
        "processed",
        filters
      ),
    remove: (i: number) => {
      connection?.removeProgramAccountChangeListener(i);
    },
  },
});

export const useGpa = <T extends unknown, P extends Idl>(
  programId: PublicKey,
  filters: GetProgramAccountsFilter[] | undefined,
  connection: Connection,
  // decode: DecodeType<T, P>,
  key: any
) => {
  const { fetcher, listener } = useMemo(
    () => fetchGpa(filters, connection, programId),

    [filters, connection, programId]
  );

  const queryClient = useQueryClient();

  const q = useQuery<IRpcObject<Buffer>[]>(key, fetcher);


  /// intercept account changes and refetch as needed
  useEffect(() => {
    let i: any;
    if (programId) {
      i = listener.add(accountUpdater(queryClient, key), programId);
    }
    return () => {
      if (i !== undefined) {
        listener.remove(i);
      }
    };
  }, [listener, programId, queryClient, key]);

  return q
};
