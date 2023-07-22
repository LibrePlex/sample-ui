import { PublicKey } from "@solana/web3.js";
import {create } from "zustand";

interface CollectionsStore  {
  selectedCollectionKeys: Set<PublicKey>;
  toggleSelectedCollection: (
    publicKey: PublicKey,
    b: boolean
  ) => void;
  setSelectedCollectionKeys: (s: Set<PublicKey>) => void;
}

const useSelectedCollections = create<CollectionsStore>(
  (set, _get) => ({
    selectedCollectionKeys: new Set(),
    toggleSelectedCollection: async (publicKey: PublicKey, b: boolean) => {
      set((s) => ({
        ...s,
        selectedCollectionKeys: new Set(
          b ? [...s.selectedCollectionKeys, publicKey] : 
          [...s.selectedCollectionKeys].filter(item=>item!==publicKey)
        )
      }));
    },
    setSelectedCollectionKeys: async (selectedCollections: Set<PublicKey>) => {
      set((s) => ({
        ...s,
        selectedCollectionKeys: selectedCollections
      }));
    },
  })
);

export default useSelectedCollections;
