import { ChakraProvider } from "@chakra-ui/react";
import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  BraveWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolongWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import theme from "components/theme/LIbrePlexTheme";
import dynamic from "next/dynamic";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { notify } from "../utils/notifications";
import { AutoConnectProvider, useAutoConnect } from "./AutoConnectProvider";
import {
  NetworkConfigurationProvider,
  useNetworkConfiguration,
} from "./NetworkConfigurationProvider";

const ReactUIWalletModalProviderDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false }
);

const getRpcUrlFromNetwork = (network: WalletAdapterNetwork | "local") => {
  if (network === WalletAdapterNetwork.Devnet) {
    return process.env.NEXT_PUBLIC_DEVNET_URL ?? clusterApiUrl(network);
  } else if (network === WalletAdapterNetwork.Mainnet) {
    return process.env.NEXT_PUBLIC_MAINNET_URL ?? clusterApiUrl(network);
  } else if (network === "local") {
    return process.env.NEXT_PUBLIC_LOCALNET_URL ?? "http://localhost:8899";
  } else {
    return clusterApiUrl(network);
  }
};

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect();
  const { networkConfiguration } = useNetworkConfiguration();
  const network = networkConfiguration as WalletAdapterNetwork | "local";
  const endpoint = useMemo(() => getRpcUrlFromNetwork(network), [network]);

  console.log(network);

  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter(),
      new PhantomWalletAdapter(),
      new BraveWalletAdapter(),
      new SolongWalletAdapter(),
    ],
    [network]
  );

  const onError = useCallback((error: WalletError) => {
    notify({
      type: "error",
      message: error.message ? `${error.name}: ${error.message}` : error.name,
    });
    console.error(error);
  }, []);

  return (
    // TODO: updates needed for updating and referencing endpoint: wallet adapter rework
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        onError={onError}
        autoConnect={autoConnect}
      >
        <ReactUIWalletModalProviderDynamic>
          {children}
        </ReactUIWalletModalProviderDynamic>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ChakraProvider theme={theme}>
      <NetworkConfigurationProvider>
        <AutoConnectProvider>
          <WalletContextProvider>{children}</WalletContextProvider>
        </AutoConnectProvider>
      </NetworkConfigurationProvider>
    </ChakraProvider>
  );
};
