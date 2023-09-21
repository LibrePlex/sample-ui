import type { NextPage } from "next";
import Head from "next/head";
import { RawAccount, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

import { HomeView } from "../../views";
import { Box, Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import {
  MintDisplay,
  usePublicKeyOrNull,
  useTokenAccountsByOwner,
} from  "@libreplex/shared-ui";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletGallery } from "../../components/gallery/wallet/WalletGallery";

import { useRouter } from "next/router";
import { PublicKey } from "@solana/web3.js";
import { WalletAction } from "@marketplace/components/gallery/wallet/walletcard/WalletAction";

const Home: NextPage = (props) => {
  const router = useRouter();
  const [routerPubkey, setRouterPubkey] = useState<PublicKey>(null);
  const { publicKey } = useWallet()
  

  useEffect(() => {
    try {
      new PublicKey(router.query.pubkey);
      setRouterPubkey(new PublicKey(router.query.pubkey));
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
    routerPubkey,
    connection,
    TOKEN_2022_PROGRAM_ID
  );

  const selectedMintTokenAccount = useMemo(
    () => mint && tokenAccounts.find((ta) => ta.item.mint.equals(mint)),
    [tokenAccounts, mint]
  );

  return (
    <>

      <Head>
        <title>LibrePlex - Wallet {router.query.pubkey}</title>
      </Head>

      <div
      style={{
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent:'flex-start',
      margin: '92px 58px', height: '100%'
      }}>

        {
          !mint && 
          <Heading 
          size={'4xl'}
          className="gradientText"
          style={{opacity: 0.7}}
          >
            {router.query.pubkey === publicKey?.toBase58() ? "My Wallet" : `${router.query.pubkey?.slice(0, 4)}...${router.query.pubkey?.slice(router.query.pubkey.length-4)}`}
          </Heading>
        }
        
        {
          routerPubkey ? 
            mint ? 
            <VStack 
            w={"100%"}
            h={'100%'}
            gap={8}
            >

              <Button 
              onClick={()=>{
                selectMint(undefined)
              }}
              my={8}
              // style={{margin}}
              >
                Back to wallet
              </Button>

              
                <MintDisplay
                  mint={mint}
                  actions={selectedMintTokenAccount && <WalletAction item={selectedMintTokenAccount} />}
                />
 
            </VStack>
            :
            <WalletGallery publicKey={routerPubkey} onSelectMint={selectMint} /> 
          :
            <Center style={{ minHeight: "500px" }}>
              <Text>Must be valid public key</Text>
            </Center>
        }


      </div>
    </>
  )
}

export default Home;
