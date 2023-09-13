import { Idl } from "@coral-xyz/anchor";
import {
  AccountInfo,
  Connection,
  GetProgramAccountsFilter,
  KeyedAccountInfo,
  ProgramAccountChangeCallback,
  PublicKey,
} from "@solana/web3.js";
import {AccountLayout, TOKEN_PROGRAM_ID} from "@solana/spl-token"
import { IRpcObject } from "../../components/executor/IRpcObject";

import { useEffect, useMemo } from "react";
import { QueryClient, useQuery, useQueryClient } from "react-query";
import { Updater } from "react-query/types/core/utils";
import { useFetchSingleAccount } from "./singleAccountInfo";

const accountUpdater =
  (queryClient: QueryClient, key: any) => (accountInfo: KeyedAccountInfo) => {
    console.log({ queryClient });
    console.log("Account updated", accountInfo);

    const newOrUpdatedItem = {
      item: accountInfo.accountInfo,
      pubkey: accountInfo.accountId,
    };

    const fn: Updater<
      IRpcObject<AccountInfo<Buffer> | undefined>[] | undefined,
      IRpcObject<AccountInfo<Buffer> | undefined>[]
    > = (old: IRpcObject<AccountInfo<Buffer> | undefined>[] | undefined) => {
      const found = (old ?? []).find((item) =>
        item.pubkey.equals(accountInfo.accountId)
      );
      // console.log({ found, old });
      if (found) {
        return (
          old?.map((item) =>
            item.pubkey.equals(accountInfo.accountId) ? newOrUpdatedItem : item
          ) ?? []
        );
      } else {
        return [...(old ?? []), newOrUpdatedItem] ?? [];
      }
    };

    queryClient.setQueryData(key, fn);
  };

export const fetchTokenAccountsByOwner = <T extends unknown, P extends Idl>(
  owner: PublicKey,
  connection: Connection,
  programId: PublicKey
) => ({
  fetcher: async () => {
    const _items: IRpcObject<Buffer>[] = [];
    const results = await connection?.getTokenAccountsByOwner(owner, {
      programId
    });

    for (const result of results.value) {
    
      // const obj = decode(result.account.data, result.pubkey);

      _items.push({
        item: result.account.data,
        pubkey: result.pubkey,
      });
    }
    return _items;
  },
  listener: {
      add: (onAccountChange: ProgramAccountChangeCallback, programId: PublicKey) =>
      owner ? connection?.onProgramAccountChange(
          programId,
          onAccountChange,
          "processed",
          [
            {
              memcmp: {
                offset: 32,
                bytes: owner?.toBase58()??'',
              },
            }
          ]
        ) : null,
      remove: (i: number) => {
        connection?.removeProgramAccountChangeListener(i);
      },
  },
});

export const useTokenAccountsByOwner = (
  owner: PublicKey,
  connection: Connection,
  programId: PublicKey,
) => {
  const { fetcher, listener } = useMemo(
    () => owner ? fetchTokenAccountsByOwner(owner, connection, programId) : 
    {fetcher: ()=>[] as any[], listener: {add: ()=>{}, remove: ()=>{}}},

    [connection, owner, programId]
  );

  const queryClient = useQueryClient();

  const key = useMemo(()=>`tokenaccountsbyowner-${owner?.toBase58()}-${connection.rpcEndpoint}`,[owner, connection])

  const q = useQuery<IRpcObject<Buffer>[]>(key, fetcher);

  /// disable listeners for now
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

  const decoded = useMemo(
    () => ({
      ...q,
      data:
        q?.data
          ?.map((item) => ({item: (item?.item?.length ?? 0) > 0 ? AccountLayout.decode(item.item) : null, pubkey: item.pubkey}))
          .filter((item) => (item?.item?.amount ??0) > 0) ?? [],
    }),

    [q]
  );

  return decoded;
};



export const useTokenAccountById = (
  tokenAccountId: PublicKey | null,
  connection: Connection
) => {
  
  const q = useFetchSingleAccount(tokenAccountId, connection);

  
  const decoded = useMemo(() => {
    try {
      const obj = q?.data?.item ? AccountLayout.decode(q?.data?.item.buffer) : null;
      return obj;
    } catch (e) {
      return null;
    }
  }, [q.data?.item]);

  return decoded;

  // return useQuery<IRpcObject<Collection>[]>(collectionKeys, fetcher);
};
