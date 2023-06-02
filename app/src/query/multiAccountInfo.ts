import { Idl, Program } from "@coral-xyz/anchor";
import {
  AccountChangeCallback,
  AccountInfo,
  Connection,
  PublicKey,
} from "@solana/web3.js";
import { IRpcObject } from "components/executor/IRpcObject";
import { useCallback, useEffect, useMemo } from "react";
import { QueryClient, useQuery, useQueryClient } from "react-query";

export type DecodeType<T extends unknown, P extends Idl> = (
  buf: Buffer,
  pubkey: PublicKey
) => IRpcObject<T>;

export const fetchMultiAccounts = <T extends unknown, P extends Idl>(
  accountKeys: PublicKey[],
  decoder: DecodeType<T, P>,
  connection: Connection,
) => ({
  fetcher: async () => {
    const _items: IRpcObject<T>[] = [];
    const remainingAccountKeys = [...accountKeys];

    while (remainingAccountKeys.length > 0) {
      /// 100 is the max for getMultipleAccountsInfo
      const batchKeys = remainingAccountKeys.splice(0, 100);

      const results = await connection.getMultipleAccountsInfo(batchKeys);

      for (const [idx, result] of results.entries()) {
        if (result?.data) {
          const obj = decoder(result.data, accountKeys[idx]);
          if (obj) {
            _items.push(obj);
          }
        }
      }
    }
    return _items;
  },
  listener: {
    add: (onAccountChange: AccountChangeCallback, accountId: PublicKey) =>
      connection.onAccountChange(accountId, onAccountChange),
    remove: (i: number) => {
      connection.removeAccountChangeListener(i);
    },
  },
});

const accountUpdater =
  <T extends unknown, P extends Idl>(
    program: Program<P>,
    accountId: PublicKey,
    decode: DecodeType<T, P>,
    queryClient: QueryClient,
    key: any
  ) =>
  (accountInfo: AccountInfo<Buffer>) => {
    console.log({ queryClient });
    console.log("Account updated (single)", accountInfo, key);

    // delete events have now started to fire, hence need to check if the
    // buffer contains anything at all
    if (accountInfo.data.length === 0) {
      /* 
          do nothing as deleting is handled elsewhere.
          could make this fully data driven though
          by adding a deleted marker on IRpcObject
      */

    } else {
      const newOrUpdatedItem = decode(accountInfo.data, accountId);
      queryClient.setQueryData(key, (old: IRpcObject<T>[]) => {
        const found = (old ?? []).find((item) => item.pubkey.equals(accountId));
        console.log({ found, old, key, newOrUpdatedItem});
        return found
          ? old.map((item) =>
              item.pubkey.equals(accountId) ? newOrUpdatedItem : item
            )
          : [...(old ?? []), newOrUpdatedItem];
      });
    }
  };

export const useFetchMultiAccounts = <T extends unknown, P extends Idl>(
  /*
    this is needed for deserialization only. 
    unlike gpa fetch we don't need the program id to find accounts on chain.
  */
  program: Program<P>,
  accountIds: PublicKey[],
  /* 
    same decoder interface as in useGpa
  */
  decode: (
    buf: Buffer,
    pubkey: PublicKey
  ) => IRpcObject<T>,
  connection: Connection,
) => {
  const { fetcher, listener } = useMemo(
    () => fetchMultiAccounts(accountIds, decode, connection),
    [accountIds, decode, connection, program]
  );

  /* 
    for now use accountids as the key.
    later might want to get clever and
    disable multiaccount fetching at the interface
    i.e. only fire individual account requests
    via the SDK but aggregate them into multiaccountfetch
    with a buffering class like BufferingConnection - have
    included a sample implementation in the codebase
    though it's not currently used.
  */
  let key = useMemo(() => accountIds, [accountIds]);

  const queryClient = useQueryClient();

  const q = useQuery<IRpcObject<T>[]>(accountIds, fetcher);

  /// intercept account changes and refetch as needed
  useEffect(() => {
    let _listeners: number[] = [];
    if ((accountIds.length ?? 0) > 0) {
      for (const accountId of accountIds) {
        console.log("Adding account listener", accountId);
        _listeners.push(
          listener.add(
            accountUpdater(program, accountId, decode, queryClient, key),
            accountId
          )
        );
      }
    }
    return () => {
      for (const i of _listeners) {
        listener.remove(i);
      }
    };
  }, [listener, accountIds, program, decode, queryClient, key]);

  return q;
};
