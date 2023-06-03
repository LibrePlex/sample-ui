import { Box, Button, ButtonProps, Spinner, Text } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { HttpClient } from "HttpClient";
import { ReactNode, useCallback } from "react";
import { notify } from "utils/notifications";

export type RequestGet<T extends unknown> = () => Promise<
  | { data: T; error: undefined }
  | {
      error: any;
      data: undefined;
    }
>;

export const WalletAuthenticatingButton = <T extends unknown>({
  disabled,
  onClick,
  children,
  isLoading,
  afterClick,
  beforeClick,
  onError,
  ...rest
}: {
  onError?: () => any;
  afterClick?: ButtonProps["onClick"];
  beforeClick?: () => any;
  children: string | ReactNode;
  onClick?: RequestGet<T>;
  isLoading: boolean;
} & ButtonProps) => {
  const { publicKey, connected, signMessage } = useWallet();

  const wrappedOnClick = useCallback(async () => {
    const httpClient = new HttpClient("/api/wallet");
    const { data: challengeData, error: challengeError } =
      await httpClient.get<{ message: string; token: string }>(
        `${publicKey.toBase58()}/createChallenge`
      );

    const encodedMessage = new TextEncoder().encode(challengeData.message);
    try {
      const signature = await signMessage(encodedMessage);

      const { data: verifyData, error: verifyError } = await httpClient.post<{
        signedAuth: string;
        walletPublicKey: string;
      }>(`${publicKey.toBase58()}/verifyChallenge`, {
        signature: [...signature],
        token: challengeData?.token,
      });
      console.log(verifyData, verifyError);
      await onClick();
    } catch (e) {
      // notify({message: (e as Error).message, type: "error"})
    }
  }, [onClick, publicKey, signMessage]);

  return connected ? (
    <>
      <Button
        {...rest}
        disabled={disabled || publicKey === null}
        variant="contained"
        onClick={async (e) => {
          beforeClick && beforeClick();
          await wrappedOnClick();
          afterClick && afterClick(e);
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            <Spinner />
          </Box>
        ) : (
          children
        )}
      </Button>
    </>
  ) : (
    <Text>Wallet not connected</Text>
  );
};
