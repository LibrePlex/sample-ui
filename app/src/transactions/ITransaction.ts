export interface ITransaction {
  partiallySignedTxs: {
    buffer: number[];
    blockhash: {
      blockhash: string;
      lastValidBlockHeight: number;
    };
    signatures: {
      signature: number[];
      pubkey: string;
    }[];
  }[];
}
