import {
    Connection,
    GetProgramAccountsFilter,
    PublicKey,
} from "@solana/web3.js";
import { IRpcObject } from "components/executor/IRpcObject";
import create, { State } from "zustand";

interface BaseRpcGpaStore<T> extends State {
  clear: () => any;
  removeItem: (itemPublicKey: PublicKey) => any;
  items: IRpcObject<T>[] | null;
  listener: any;
  isFetching: boolean;
  fetch: (filters: GetProgramAccountsFilter[], connection: Connection) => any;
}

export const useGenericGpaStore = <T extends unknown>(
  programId: PublicKey,
  decoder: (buffer: Buffer, publicKey: PublicKey) => T | null
) =>
  create<BaseRpcGpaStore<T>>((set, _get) => ({
    isFetching: false,
    items: null,
    interval: null,
    listener: null,
    clear: () => {
      set((s) => (s.items = null));
    },
    removeItem: (publicKeyToRemove: PublicKey) => {
      set((s) => {
        s.items = s.items.filter(
          (item) => !item.pubkey.equals(publicKeyToRemove)
        );
      });
    },
    fetch: async (filters, connection: Connection) => {
      const _items: IRpcObject<T>[] = [];
      const results = await connection.getProgramAccounts(programId, {
        filters,
      });

      console.log("FETCHED");

      for (const result of results.values()) {
        const obj = decoder(result.account.data, result.pubkey);

        _items.push({
          pubkey: result.pubkey,
          item: obj,
        });
      }

      set((s) => {
        s.items = _items;
      });
    },
  }));
