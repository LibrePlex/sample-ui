import { PublicKey } from "@solana/web3.js";
import create, { State } from "zustand";

interface SelectedPermissionsStore  {
  selectedPermissionKeys: Set<PublicKey>;
  toggleSelectedPermission: (
    publicKey: PublicKey,
    b: boolean
  ) => void;
  setSelectedPermissionKeys: (s: Set<PublicKey>) => void;
}

const useSelectedPermissions = create<SelectedPermissionsStore>(
  (set, _get) => ({
    selectedPermissionKeys: new Set(),
    toggleSelectedPermission: async (publicKey: PublicKey, b: boolean) => {
      set((s) => ({
        ...s,
        selectedPermissionKeys: new Set(
          b ? [...s.selectedPermissionKeys, publicKey] : 
          [...s.selectedPermissionKeys].filter(item=>item!==publicKey)
        )
      }));
    },
    setSelectedPermissionKeys: async (selectedPermissions: Set<PublicKey>) => {
      set((s) => ({
        ...s,
        selectedPermissionKeys: selectedPermissions
      }));
    },
  })
);

export default useSelectedPermissions;
