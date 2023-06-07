import { PublicKey } from "@solana/web3.js";
import create, { State } from "zustand";

interface SelectedMetadata extends State {
  selectedMetadataKeys: Set<PublicKey>;
  toggleSelectedMetadataKey: (
    publicKey: PublicKey,
    b: boolean
  ) => void;
  setSelectedMetadataKeys: (s: Set<PublicKey>) => void;
}

const useSelectedMetadata = create<SelectedMetadata>(
  (set, _get) => ({
    selectedMetadataKeys: new Set(),
    toggleSelectedMetadataKey: async (publicKey: PublicKey, b: boolean) => {
      set((s) => {
        s.selectedMetadataKeys = new Set(
          b ? [...s.selectedMetadataKeys, publicKey] : 
          [...s.selectedMetadataKeys].filter(item=>item!==publicKey)
        );
      });
    },
    setSelectedMetadataKeys: async (selectedMetadataKeys: Set<PublicKey>) => {
      set((s) => {
        s.selectedMetadataKeys = selectedMetadataKeys;
      });
    },
  })
);

export default useSelectedMetadata;
