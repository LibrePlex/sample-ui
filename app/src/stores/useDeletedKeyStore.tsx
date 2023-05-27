import create, { State } from 'zustand'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

interface DeletedKeysStore extends State {
  deletedKeys: Set<PublicKey>;
  addDeletedKey: (publicKey: PublicKey) => void
}

const useDeletedKeysStore = create<DeletedKeysStore>((set, _get) => ({
  deletedKeys: new Set(),
  addDeletedKey: async (publicKey) => {
    
    set((s) => {
      s.deletedKeys = new Set([...s.deletedKeys, publicKey])
    })
  },
}));

export default useDeletedKeysStore;