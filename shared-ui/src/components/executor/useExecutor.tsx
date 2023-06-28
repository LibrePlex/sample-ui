import {
  ConnectionContext,
  useWallet,
  WalletContextState,
} from "@solana/wallet-adapter-react";
import { useCallback, useContext, useState, useMemo, useEffect } from "react";
import { Executor, FetchSignature } from "./Executor";
import { notify } from "../../utils/notifications";

export enum NotifyType {
  Success,
  Error,
}

export const useExecutor = <P extends unknown>(
  fetch: FetchSignature<{
    params: P;
    wallet: {
      publicKey: WalletContextState["publicKey"];
      signTransaction: WalletContextState["signTransaction"];
      signAllTransactions: WalletContextState["signAllTransactions"];
    };
  }>,

  params: P,
  commitment: "processed" | "confirmed" | "finalized",
  onSuccess: (msg?: string) => any,
  onError: (msg?: string) => any,
  onInfo?: (msg?: string) => any,
  afterSign?: () => any
) => {
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  const {connection} = useContext(ConnectionContext);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const onClick = useCallback(async () => {
    if (publicKey && signAllTransactions) {
      // console.log({params});
      const executor = new Executor(
        fetch,

        {
          params,
          wallet: {
            publicKey,
            signTransaction,
            signAllTransactions,
          },
        },
        signAllTransactions,
        connection,
        commitment,
        publicKey,
        onSuccess,
        onInfo || onSuccess,
        onError,
        ()=>{},
        afterSign
      );

      try {
        setIsExecuting(true);
        const transactionResults = await executor.execute();
        setIsExecuting(false);
        return transactionResults;
      } catch (e) {
        if (
          (e as Error).message.indexOf(
            "This transaction has already been processed"
          ) > -1
        ) {
          onSuccess("Success");
        } else {
          onError((e as Error).message);
        }

        setIsExecuting(false);
      }
    } else {
      notify({type: 'error', message: "Tx runner not ready. Are you logged in?"});
    }
  }, [
    publicKey,
    signAllTransactions,
    fetch,
    params,
    signTransaction,
    connection,
    commitment,
    onSuccess,
    onError,
    afterSign
  ]);

  return { isExecuting, onClick };
};
