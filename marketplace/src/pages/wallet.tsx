import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";
import { Text } from "@chakra-ui/react";
import { ContextProvider, useTokenAccountsByOwner } from "shared-ui";
import React, { useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletGallery } from "../components/gallery/WalletGallery";
import { QueryClient, QueryClientProvider } from "react-query";
const Home: NextPage = (props) => {
  const { publicKey } = useWallet();
  const queryClient = useMemo(() => new QueryClient({}), []);

  return (
    <div>
      <Head>
        <title>LibrePlex</title>
        <meta name="description" content="Your wallet" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <ContextProvider>
          {publicKey ? (
            <WalletGallery publicKey={publicKey} />
          ) : (
            <Text>Please connect your wallet</Text>
          )}
        </ContextProvider>
      </QueryClientProvider>
    </div>
  );
};

export default Home;
