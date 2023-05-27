import {
  Connection,
  GetProgramAccountsFilter,
  ProgramAccountChangeCallback,
  PublicKey,
} from "@solana/web3.js";
import { IRpcObject } from "components/executor/IRpcObject";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";

export const fetchGpa = <T extends unknown>(
  programId: PublicKey,
  filters: GetProgramAccountsFilter[],
  connection: Connection,
  decode: (buf: Buffer, key: PublicKey) => T
) => ({
  fetcher: async () => {
    const _items: IRpcObject<T>[] = [];
    const results = await connection.getProgramAccounts(programId, {
      filters,
    });

    for (const result of results.values()) {
      const obj = decode(result.account.data, result.pubkey);

      _items.push({
        pubkey: result.pubkey,
        item: obj,
        deleted: false,
      });
    }

    return _items;
  },
  listener: {
    add: (onAccountChange: ProgramAccountChangeCallback) =>
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

export const useGpa = <T extends unknown>(
  programId: PublicKey,
  filters: GetProgramAccountsFilter[],
  connection: Connection,
  decode: (buf: Buffer, key: PublicKey) => T,
  key: string[]
) => {
  const { fetcher, listener } = useMemo(
    () => fetchGpa(programId, filters, connection, decode),

    [programId, filters, connection, decode]
  );

  const q = useQuery(key, fetcher);

  const { data: items, refetch } = q;

  const [addedItems, setAddedItems] = useState<
    { pubkey: PublicKey; item: T }[]
  >([]);

  /// intercept account changes and refetch as needed
  useEffect(() => {
    const i = listener.add((accountInfo) => {
      const found = items.find((item) =>
        item.pubkey.equals(accountInfo.accountId)
      );

      const newOrUpdatedItem = {
        pubkey: accountInfo.accountId,
        item: decode(accountInfo.accountInfo.data, accountInfo.accountId),
      };

      if (found) {
        // is in added, if so update there

        if (addedItems.find((item) => item.pubkey === accountInfo.accountId)) {
          setAddedItems((old) =>
            old.map((item) =>
              item.pubkey === accountInfo.accountId ? newOrUpdatedItem : item
            )
          );
        } else {
          setAddedItems((old) => [...old, newOrUpdatedItem]);
        }
      } else {
        setAddedItems((old) => [...old, newOrUpdatedItem]);
      }
    });
    return () => {
      listener.remove(i);
    };
  }, [listener, items, addedItems]);

  
  const addedKeys = useMemo(
    () => new Set([...addedItems.map((item) => item.pubkey)]),
    [addedItems]
  );

  const allItems = useMemo(
    () => [
      ...(items?.filter((item) => !addedKeys.has(item.pubkey)) ?? []),
      ...(addedItems ?? []),
    ],
    [items, addedItems, addedKeys]
  );

  return {
    ...q,
    data: allItems,
    /// maybe move these to a redux store?
    // markAsDeleted,
  };
};
