import { PublicKey } from "@solana/web3.js";
import { create, createStore } from "zustand";

interface SelectedMetadata {
  selectedMetadataKeys: Set<string>;
  toggleSelectedMetadataKey: (
    publicKey: string,
    b: boolean
  ) => void;
  setSelectedMetadataKeys: (s: Set<string>) => void;
}

const useSelectedMetadata = create<SelectedMetadata>(
  (set, _get) => ({
    selectedMetadataKeys: new Set(),
    toggleSelectedMetadataKey: async (publicKey: string, b: boolean) => {
      set((s) => {
        console.log({s, publicKey, b})
        return {
        ...s,
        selectedMetadataKeys: new Set(
          b ? [...s.selectedMetadataKeys, publicKey] : 
          [...s.selectedMetadataKeys].filter(item=>item!==publicKey)
        )
      }});
    },
    setSelectedMetadataKeys: async (selectedMetadataKeys: Set<string>) => {
      set((s) => ({
        ...s,
        selectedMetadataKeys
      }));
    },
  })
);

export default useSelectedMetadata;
