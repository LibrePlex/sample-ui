import { Idl, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { createStore } from "zustand";

interface DeletedKeys {
  deletedKeys: Set<PublicKey>;
}

export interface DeletedKeysState extends DeletedKeys {
  addDeletedKey: (publicKey: PublicKey) => void;
}

export type DeletedKeysStore = ReturnType<
  typeof createDeletedKeyStore
>;

export const createDeletedKeyStore = <T extends Idl>(
  program: Program<T>,
) => {
  const DEFAULT_PROPS = {
    deletedKeys: new Set<PublicKey>(),
  };

  const store = createStore<DeletedKeysState>()((set) => ({
    ...DEFAULT_PROPS,
    addDeletedKey: (publicKey: PublicKey) => {
      return set((state) => ({
        ...state,
        deletedKeys: new Set<PublicKey>([...state.deletedKeys, publicKey]),
      }));
    },
  }));

  const state = store.getState();

  program?.addEventListener("DeleteEvent", (event, slot, sig) => {
    state.addDeletedKey(event.id);
  });

  return store;
};
