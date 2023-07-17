import type { NextPage } from "next";
import Head from "next/head";
import { RawAccount, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

import { HomeView } from "../../views";
import { Box, Button, Center, Text } from "@chakra-ui/react";
import {
  ContextProvider,
  MintDisplay,
  usePublicKeyOrNull,
  useTokenAccountsByOwner,
} from "shared-ui";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletGallery } from "../../components/gallery/wallet/WalletGallery";
import { QueryClient, QueryClientProvider } from "react-query";
import { useRouter } from "next/router";
import { PublicKey } from "@solana/web3.js";
import { ListMintTransactionButton } from "@/components/gallery/wallet/walletcard/ListMintTransactionButton";
import { WalletAction } from "@/components/gallery/wallet/walletcard/WalletAction";

const Home: NextPage = (props) => {
  const router = useRouter();
  const [pubkey, setPubkey] = useState<PublicKey>(null);

  useEffect(() => {
    try {
      new PublicKey(router.query.pubkey);
      setPubkey(new PublicKey(router.query.pubkey));
    } catch (error) {}
  }, [router.query.pubkey]);

  const selectMint = useCallback(
    (mint: PublicKey | undefined) => {
      if( mint) {
        router.query.mintId = mint?.toBase58()
      } else {
        const {mintId, ...rest} = router.query
        router.query = rest;
      }
      router.push(router);
    },
    [router]
  );

  const mintId = useMemo(() => router.query.mintId, [router.query]);

  const mint = usePublicKeyOrNull(mintId as string);

  const { connection } = useConnection();

  const { data: tokenAccounts } = useTokenAccountsByOwner(
    pubkey,
    connection,
    TOKEN_2022_PROGRAM_ID
  );

  const selectedMintTokenAccount = useMemo(
    () => mint && tokenAccounts.find((ta) => ta.item.mint.equals(mint)),
    [tokenAccounts, mint]
  );

  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      {pubkey ? (
        mint ? (
          <Box w={"100%"}>
            <Button m={30} onClick={()=>{
              selectMint(undefined)
            }}>Back to wallet</Button>
            <Center style={{ minHeight: "500px" }}>
              <MintDisplay
                mint={mint}
                actions={selectedMintTokenAccount && <WalletAction item={selectedMintTokenAccount} />}
              />
            </Center>
          </Box>
        ) : (
          <WalletGallery publicKey={pubkey} onSelectMint={selectMint} />
        )
      ) : (
        <Center style={{ minHeight: "500px" }}>
          <Text>Must be valid public key</Text>
        </Center>
      )}
    </div>
  );
};

export default Home;
