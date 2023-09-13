import { Idl } from "@coral-xyz/anchor";
import {
  AccountChangeCallback,
  AccountInfo,
  Connection,
  PublicKey,
} from "@solana/web3.js";
import { IRpcObject } from "../../components/executor/IRpcObject";
import { useEffect, useMemo } from "react";
import { QueryClient, useQuery, useQueryClient } from "react-query";
import { BufferingConnection } from "@libreplex/shared-ui";

export type DecodeType<T extends unknown, P extends Idl> = (
  buf: Buffer,
  pubkey: PublicKey
) => IRpcObject<T>;

export const fetchSingleAccount = (
  accountKey: PublicKey | null,
  connection: Connection
) => ({
  fetcher: async () => {
    const bufferingConnection = BufferingConnection.getOrCreate(connection);
    if (accountKey) {
      const result = await bufferingConnection.getMultipleAccountsInfo([
        accountKey,
      ]);

      return {
        pubkey: accountKey,
        item: result[0]?.data
          ? {
              buffer: result[0]?.data,
              balance: result[0].balance || BigInt(0),
            }
          : null,
      };
    } else {
      return null;
    }
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
  (accountId: PublicKey, queryClient: QueryClient, key: any) =>
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
      queryClient.setQueryData(
        key,
        (
          old:
            | IRpcObject<{ buffer: Buffer; balance: bigint } | undefined>
            | undefined
        ) => {
          const newOrUpdatedItem = {
            item: {
              buffer: accountInfo.data,
              balance: BigInt(accountInfo.lamports),
            },
            pubkey: accountId,
          };
          return newOrUpdatedItem;
        }
      );
    }
  };

export const useFetchSingleAccount = (
  /*
    this is needed for deserialization only. 
    unlike gpa fetch we don't need the program id to find accounts on chain.
  */
  accountId: PublicKey | null,
  /* 
    same decoder interface as in useGpa
  */
  connection: Connection,
  live?: boolean
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

  const key = useMemo(()=>accountId?.toBase58()??'dummy', [accountId])

  const q = useQuery<IRpcObject<{
    buffer: Buffer;
    balance: bigint;
  } | null> | null>(key, fetcher);

  /// intercept account changes and refetch as needed
  useEffect(() => {
    let _listeners: number[] = [];

    if (accountId && live !== false) {
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
  }, [listener, accountId, queryClient, live]);

  return q;
};
