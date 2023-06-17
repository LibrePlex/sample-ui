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
import { BufferingConnection } from "stores/BufferingConnection";

export type DecodeType<T extends unknown, P extends Idl> = (
  buf: Buffer,
  pubkey: PublicKey
) => IRpcObject<T>;

export const fetchSingleAccount = <T extends unknown, P extends Idl>(
  accountKey: PublicKey,
  connection: Connection
) => ({
  fetcher: async () => {
    const bufferingConnection = BufferingConnection.getOrCreate(connection);

    const result = await bufferingConnection.getMultipleAccountsInfo([
      accountKey,
    ]);

    return {
      pubkey: accountKey,
      item: result[0]?.data || null,
    };
  },
  listener: {
    add: (onAccountChange: AccountChangeCallback, accountId: PublicKey) =>
      connection &&
      accountId &&
      connection.onAccountChange(accountId, onAccountChange),
    remove: (i: number) => {
      connection && connection.removeAccountChangeListener(i);
    },
  },
});

const accountUpdater =
  <P extends Idl>(accountId: PublicKey, queryClient: QueryClient, key: any) =>
  (accountInfo: AccountInfo<Buffer>) => {
    // delete events have now started to fire, hence need to check if the
    // buffer contains anything at all
    if (accountInfo.data.length === 0) {
      /* 
          do nothing as deleting is handled elsewhere.
          could make this fully data driven though
          by adding a deleted marker on IRpcObject
      */
    } else {
      queryClient.setQueryData(key, (old: IRpcObject<Buffer>) => {
        const newOrUpdatedItem = { item: accountInfo.data, pubkey: accountId };
        return newOrUpdatedItem
        // const found = (old ?? []).find((item) => item.pubkey.equals(accountId));
        // // console.log({ found, old, key, newOrUpdatedItem });
        

        // return found
        //   ? old.map((item) =>
        //       item.pubkey.equals(accountId) ? newOrUpdatedItem : item
        //     )
        //   : [...(old ?? []), newOrUpdatedItem];
      });
    }
  };

export const useFetchSingleAccount = <T extends unknown, P extends Idl>(
  /*
    this is needed for deserialization only. 
    unlike gpa fetch we don't need the program id to find accounts on chain.
  */
  accountId: PublicKey,
  /* 
    same decoder interface as in useGpa
  */
  connection: Connection
) => {
  const { fetcher, listener } = useMemo(
    () => fetchSingleAccount(accountId, connection),
    [accountId, connection]
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

  const queryClient = useQueryClient();

  const q = useQuery<IRpcObject<Buffer>>([accountId], fetcher);

  /// intercept account changes and refetch as needed
  useEffect(() => {
    let _listeners: number[] = [];

    if (accountId) {
      _listeners.push(
        listener.add(
          accountUpdater(accountId, queryClient, accountId),
          accountId
        )
      );
    }

    return () => {
      for (const i of _listeners) {
        listener.remove(i);
      }
    };
  }, [listener, accountId, queryClient]);

  return q;
};
