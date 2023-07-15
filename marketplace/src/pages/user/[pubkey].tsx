import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../../views";
import { Center, Text } from "@chakra-ui/react";
import { ContextProvider, useTokenAccountsByOwner } from "shared-ui";
import React, { useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletGallery } from "../../components/gallery/wallet/WalletGallery";
import { QueryClient, QueryClientProvider } from "react-query";
import { useRouter } from "next/router";
import { PublicKey } from "@solana/web3.js";

const Home: NextPage = (props) => {
  const router = useRouter();
  const [pubkey, setPubkey] = useState<PublicKey>(null)

  useEffect(() => {
    try {
      new PublicKey(router.query.pubkey)
      setPubkey(new PublicKey(router.query.pubkey))
    } catch (error) {

    }
  }, [router.query.pubkey])
  



  
  return (
    <div style={{display: 'flex', alignItems: 'flex-start'}}>
          {pubkey ? (
            <WalletGallery publicKey={pubkey} />
          ) : (
            <Center style={{minHeight: '500px'}}><Text>Must be valid public key</Text></Center>
          )}

    </div>
  );
};

export default Home;
