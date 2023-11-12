import { Box, Button, ButtonProps, Spinner, Text } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { ReactNode, useCallback, useState } from "react";
import { HttpClient } from "../../utils/HttpClient";
import dynamic from "next/dynamic";

export type RequestGet<T extends unknown> = () => Promise<
  | { data: T; error: undefined }
  | {
      error: any;
      data: undefined;
    }
>;

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

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
    if (!publicKey || !signMessage) {
      console.log("Wallet not connected");
      return;
    }
    const { data: challengeData, error: challengeError } =
      await httpClient.get<{ message: string; token: string }>(
        `${publicKey.toBase58()}/createChallenge`
      );

    const encodedMessage = new TextEncoder().encode(challengeData?.message);
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
      onClick && (await onClick());
    } catch (e) {
      // notify({message: (e as Error).message, type: "error"})
    }
  }, [onClick, publicKey, signMessage]);

  const [clicking, setClicking] = useState<boolean>(false);

  return connected ? (
    <>
      <Button
        sx={{ color: "#aaa" }}
        {...rest}
        disabled={disabled || publicKey === null}
        onClick={async (e) => {
          setClicking(true);
          beforeClick && beforeClick();
          await wrappedOnClick();
          afterClick && afterClick(e);
          setClicking(false);
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
        ) : clicking ? (
          "Signing in wallet..."
        ) : (
          children
        )}
      </Button>
    </>
  ) : (
    <WalletMultiButtonDynamic/>
  );
};
