import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
} from "@solana/web3.js";
import { IRpcObject } from "components/executor/IRpcObject";
import create, { State } from "zustand";

export interface BaseRpcGpaStore<T> extends State {
  clear: () => any;
  removeItem: (itemPublicKey: PublicKey) => any;
  items: IRpcObject<T>[] | null;
  listener: any;
  isFetching: boolean;
  fetch: (accountKeys: PublicKey[], connection: Connection) => any;
}

export const useGenericMultiAccountInfoStore = <T extends unknown>(
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
    fetch: async (accountKeys: PublicKey[], connection: Connection) => {
      set((s) => {
        s.isFetching = true
      });
      const _items: IRpcObject<T>[] = [];
      const remainingAccountKeys = [...accountKeys];

      while (remainingAccountKeys.length > 0) {
        /// 100 is the max for getMultipleAccountsInfo
        const batchKeys = remainingAccountKeys.splice(0, 100);

        const results = await connection.getMultipleAccountsInfo(batchKeys);


        for (const [idx, result] of results.entries()) {
          console.log({result})
          if (result?.data) {
            const obj = decoder(result.data, accountKeys[idx]);
            console.log({obj})
            if (obj) {
              _items.push({
                pubkey: batchKeys[idx],
                item: obj,
              });
            }
          }
        }
      }

      set((s) => {
        s.items = _items;
        s.isFetching = false
      });
    },
  }));
