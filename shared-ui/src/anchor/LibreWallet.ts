import { Wallet as AnchorWallet } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";

export class LibreWallet implements AnchorWallet {
  constructor(readonly payer: Keypair) {
    this.payer = payer;
  }

  async signTransaction(tx: any): Promise<any> {
    tx.partialSign(this.payer);
    return tx;
  }

  async signAllTransactions(txs: any[]): Promise<any[]> {
    return txs.map((t) => {
      t.partialSign(this.payer);
      return t;
    });
  }

  get publicKey(): PublicKey {
    return this.payer.publicKey;
  }
}
