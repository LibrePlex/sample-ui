import { Wallet, WalletContextState } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionStatus,
  sendAndConfirmRawTransaction,
} from "@solana/web3.js";
import { ITransactionTemplate } from "./ITransactionTemplate";

export type FetchSignature<P> = (
  p: P,
  connection: Connection,
  cluster: string
) => Promise<{ data?: ITransactionTemplate[]; error?: any }>;

export const DEFAULT_TIMEOUT = 32000;

export interface IExecutorWallet
  extends Omit<
    WalletContextState,
    "publicKey" | "signTransaction" | "signAllTransactions"
  > {
  publicKey: NonNullable<WalletContextState["publicKey"]>;
  signTransaction: WalletContextState["signTransaction"];
  signAllTransactions: WalletContextState["signAllTransactions"];
}

export interface IExecutorParams<T> {
  params: T;
  wallet: IExecutorWallet;
}

export enum TransactionResult {
  NotStarted,
  TxObtained,
  TxMissing,
  Success,
  Error,
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const TX_BATCH_SIZE = 64;

export class Executor<P> {
  private readonly fetch: FetchSignature<P>;
  private readonly walletPublicKey: PublicKey;
  private readonly signAllTransactions: (
    txs: Transaction[]
  ) => Promise<Transaction[]>;
  private readonly connection: Connection;
  private readonly params: P;
  private readonly commitment: "processed" | "confirmed" | "finalized";
  private readonly onSuccess: (msg?: string) => any;
  private readonly onError: (msg?: string) => any;
  private readonly afterSign: undefined | (() => any);
  private readonly cluster: string;

  constructor(
    fetch: FetchSignature<P>,

    params: P,
    signAllTransactions: (txs: Transaction[]) => Promise<Transaction[]>,
    connection: Connection,
    cluster: string,
    commitment: "processed" | "confirmed" | "finalized",
    walletPublicKey: PublicKey,
    onSuccess: (msg?: string) => any,
    onError: (msg?: string) => any,
    afterSign?: () => any
  ) {
    this.fetch = fetch;
    this.signAllTransactions = signAllTransactions;
    this.params = params;
    // if ((this.params as any).params?.name) {
    //   console.log("SETTING PARAMS TO ", this.params);
    // }
    this.connection = connection;
    this.commitment = commitment;
    this.onSuccess = onSuccess;
    this.onError = onError;
    this.walletPublicKey = walletPublicKey;
    this.afterSign = afterSign;
    this.cluster = cluster;
  }

  public getSignedTransactions = async (
    transactions: ITransactionTemplate[]
  ) => {
    
    
    const transactionsWithPositions = transactions.map((tx, txPosition) => {
      const transaction = new Transaction();
      transaction.recentBlockhash = tx.blockhash.blockhash;
      transaction.feePayer = this.walletPublicKey;
      for (const instruction of tx.instructions) {
        transaction.add(instruction);
      }
      if (tx.signers.length > 0) {
        transaction.partialSign(...tx.signers);
      }

      const serializedTransaction = transaction.serialize({
        verifySignatures: false,
      });

      // console.log(`Tx length ${serializedTransaction.length}`);
      return {
        tx: Transaction.from(Buffer.from(serializedTransaction)),
        pos: txPosition,
      };
    });

    const signedTransactions: Transaction[] = await this.signAllTransactions(
      transactionsWithPositions.map((item) => item.tx)
    ).catch((e) => {
      this.onError("Signing rejected");
      return undefined;
    });

    this.afterSign && this.afterSign();

    // hack and won't work with multiple transactions

    if (!signedTransactions) {
      return { signedTransactions: undefined };
    }

    for (const [idx, signedTransaction] of signedTransactions.entries()) {
      const signatures = transactions[idx].signatures;
      for (const signature of signatures) {
        console.log({ pubkey: signature.pubkey, sig: signature.signature });
        signedTransaction.addSignature(
          new PublicKey(signature.pubkey),
          Buffer.from(signature.signature)
        );
      }
      // console.log({
      //   finalSignatures: signedTransaction.signatures.map((item) => ({
      //     pubkey: item.publicKey.toBase58(),
      //     sig: item.signature,
      //   })),
      // });
    }

    return {
      signedTransactions: signedTransactions.map(
        (item: Transaction, idx: number) => ({
          transaction: item,
          description: transactions[idx].description,
          blockhash: transactions[idx].blockhash
        })
      ),
    };
  };

  public execute = async () => {
    // const signedTransactions = await this.getSignedTransactions();
    const result = await this.fetch(this.params, this.connection, this.cluster)
      .catch((e) => {
        console.log(e);
        return { error: (e as Error).message, data: undefined };
      })
      .then((result) => result);
    const { data: transactions, error } = result;

    if (!transactions) {
      this.onError("Could not generate transactions");
      return;
    }
    if( transactions.length === 0 ) {
      this.onSuccess();
      return;
    }

    const remainingTransactions = [...transactions];
    let batchId = 0;
    let awaitConfirmation = transactions.length < 3;

    while (remainingTransactions.length > 0) {
      try {
        batchId++;
        const thisBatch = remainingTransactions.splice(0, TX_BATCH_SIZE);

        const { signedTransactions } =
          await this.getSignedTransactions(thisBatch);

        if (signedTransactions) {
          const signedTransactionsBatch = [...signedTransactions];
          while (signedTransactionsBatch.length > 0) {
            const thisBatchSigned = signedTransactionsBatch.splice(0, 10);
            const promises = Promise.all(
              thisBatchSigned.map((item, idx) =>
                this.connection
                  .sendRawTransaction(
                    item.transaction.serialize({
                      verifySignatures: true,
                    }),
                    {
                      skipPreflight: true,
                    }
                  )
                  .then(async (txid) => {
                    if (awaitConfirmation) {
                      const result = await sendAndConfirmRawTransaction(
                        this.connection,
                        item.transaction.serialize({
                          verifySignatures: false,
                        }),
                        {
                          signature: txid,
                          ...thisBatchSigned[idx].blockhash
                        },
                        {
                          skipPreflight: false,
                          maxRetries: 5,
                        }
                      );
                      // console.log(result);
                      return result;
                    } else {
                      return txid;
                    }
                  })
                  .catch((err) => {
                    console.log({ err });
                    // this.onError((err as Error).message);
                    return null;
                  })
              )
            );

            await promises
              .then((success) => {
                const successCount = success.reduce(
                  (a, b) => (b ? a + 1 : a),
                  0
                );
                // console.log({ success, successCount });
                if (successCount > 0) {
                  this.onSuccess(`Success: ${successCount}/${success.length}`);
                } else {
                  this.onError("Could not execute transactions");
                }
              })
              .catch((err) => {
                console.log({ err });
                this.onError((err as Error).message);
              });
            // const result = await executeTransactions(
            //   this.connection,
            //   signedTransactions?.map((item) => item.transaction.serialize())
            // );
          }
        } else {
          this.onError("No transactions to execute");
        }
      } catch (e) {
        console.log(e);
        this.onError("An error occurred");
      }
    }
  };
}
