import { IExecutorParams } from "../executor/Executor";
import { useExecutor } from "../executor/useExecutor";
import { Connection } from "@solana/web3.js";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { ITransactionTemplate } from "./ITransactionTemplate";
import { ButtonProps, Spinner, Text } from "@chakra-ui/react";
import { Button, ButtonGroup, VStack } from "@chakra-ui/react";
import React from "react";

export interface GenericTransactionButtonProps<P> {
  params: P;
  formatting: ButtonProps;
  beforeClick?: () => any;
  afterSign?: () => any;
  transactionGenerator: (
    { wallet, params }: IExecutorParams<P>,
    connection: Connection,
    cluster: string
  ) => Promise<{
    data?: ITransactionTemplate[];
    error?: any;
  }>;
  disableSuccess?: boolean; // prevent the button being replaced by 'success' text after processing finishes
  onSuccess?: (msg: string | undefined) => any;
  onError?: (msg: string | undefined) => any;
  multiUse?: boolean
}

export const useGenericTransactionClick = <P extends unknown>({
  params,
  transactionGenerator,
  onSuccess,
  onError,
  beforeClick,
  afterSign,
}: Omit<
  GenericTransactionButtonProps<P>,
  "formatting" | "text" | "disableSuccess"
>) => {
  const { onClick, isExecuting: isExecuting } = useExecutor(
    transactionGenerator,

    params,
    "confirmed",
    (msg) => {
      onSuccess && onSuccess(msg);
    },
    (msg) => {
      onError && onError(msg);
    },
    undefined,
    afterSign
  );

  const wrappedClick = useCallback(async () => {
    beforeClick && (await beforeClick());
    await onClick();
  }, [beforeClick, onClick]);

  return { onClick: wrappedClick, isExecuting };
};

export const GenericTransactionButton = <P extends unknown>({
  params,
  formatting,
  text,
  transactionGenerator,
  onSuccess,
  onError,
  beforeClick,
  afterSign,
  disableSuccess,
  multiUse
}: GenericTransactionButtonProps<P> & { text: ReactNode } & Omit<
    ButtonProps,
    "onError"
  >) => {
  const [success, setSuccess] = useState<boolean>(false);
 
  const { onClick, isExecuting } = useGenericTransactionClick({
    params,
    beforeClick,
    transactionGenerator,
    onSuccess: (msg) => {
      setSuccess(true);
      onSuccess && onSuccess(msg);
    },
    onError,
    afterSign,
  });

  useEffect(() => {
    if (isExecuting) setSuccess(false);
  }, [isExecuting]);
  const { children, ...rest } = formatting;

  return (
    <VStack>
      {(multiUse || !success) && <Button
        disabled={isExecuting}
        colorScheme="teal"
        size="md"
        {...rest}
        onClick={onClick}
      >
        {isExecuting ? <Spinner /> : text}
      </Button>}
      {success && !disableSuccess && <Text>Success</Text>}
    </VStack>
  );
};
