import { Keypair, TransactionInstruction } from "@solana/web3.js";

export interface ITransactionTemplate {
  instructions: TransactionInstruction[];
  signers: Keypair[];
  signatures?: {
    signature: number[],
    pubkey: string
  }[],
  description: string
}
