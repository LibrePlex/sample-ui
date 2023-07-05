import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";
import { Text } from "@chakra-ui/react";
import { ContextProvider, useTokenAccountsByOwner } from "shared-ui";
import React, { useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletGallery } from "../components/gallery/WalletGallery";
import { QueryClient, QueryClientProvider } from "react-query";
import { ListingGallery } from "../components/gallery/Listings";
const Home: NextPage = (props) => {
  const { publicKey } = useWallet();
  
  return (
    <div>
        
          {publicKey ? (
            <ListingGallery publicKey={publicKey} />
          ) : (
            <Text>Please connect your wallet</Text>
          )}

    </div>
  );
};

export default Home;
