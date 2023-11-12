import {
  ConnectionContext,
  useWallet,
  WalletContextState,
} from "@solana/wallet-adapter-react";
import { useCallback, useContext, useState, useMemo, useEffect } from "react";
import {
  Executor,
  FetchSignature,
  IExecutorParams,
  IExecutorWallet,
} from "./Executor";
import { notify } from "../../utils/notifications";
import { useCluster } from "../../contexts";

export enum NotifyType {
  Success,
  Error,
}

export const useExecutor = <P extends unknown>(
  fetch: FetchSignature<{
    params: P;
    wallet: IExecutorWallet;
  }>,

  params: P,
  commitment: "processed" | "confirmed" | "finalized",
  onSuccess: (msg?: string) => any,
  onError: (msg?: string) => any,
  onInfo?: (msg?: string) => any,
  afterSign?: () => any
) => {
  const wallet = useWallet();

  const { connection } = useContext(ConnectionContext);
  const { cluster } = useCluster();
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const onClick = useCallback(async () => {
    if (wallet.publicKey && wallet.signAllTransactions) {
      // console.log({params});
      const executor = new Executor(
        fetch,

        {
          params,
          wallet: {
            ...wallet,
            publicKey: wallet.publicKey! // checked above this is ok
          },
        },
        wallet.signAllTransactions,
        connection,
        cluster,
        commitment,
        wallet.publicKey,
        onSuccess,
        onError,
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
      notify({
        type: "error",
        message: "Tx runner not ready. Are you logged in?",
      });
    }
  }, [
    wallet,
    fetch,
    params,

    connection,
    commitment,
    onSuccess,
    onError,
    afterSign,
  ]);

  return { isExecuting, onClick };
};
