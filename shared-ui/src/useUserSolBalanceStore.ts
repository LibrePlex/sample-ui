import create, { State } from 'zustand'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

interface UserSOLBalanceStore extends State {
  balance: bigint;
  getUserSOLBalance: (publicKey: PublicKey, connection: Connection) => void
}

export const useUserSolBalanceStore = create<UserSOLBalanceStore>((set, _get) => ({
  balance: BigInt(0),
  getUserSOLBalance: async (publicKey, connection) => {
    let balance = BigInt(0);
    try {
      balance = BigInt(await connection.getBalance(
        publicKey,
        'confirmed'
      ));
      balance = balance / BigInt(LAMPORTS_PER_SOL);
    } catch (e) {
      console.log(`error getting balance: `, e);
    }
    set((s) => {
      s.balance = balance;
      console.log(`balance updated, `, balance);
    })
  },
}));

