import type { NextPage } from "next";
import Head from "next/head";

import { Center, Heading, Text } from "@chakra-ui/react";
import {
  usePublicKeyOrNull
} from "@libreplex/shared-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { WalletGallery } from "../../components/gallery/wallet/WalletGallery";

import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";

const Home: NextPage = (props) => {
  const router = useRouter();
  const [routerPubkey, setRouterPubkey] = useState<PublicKey>(null);
  const { publicKey } = useWallet();

  useEffect(() => {
    try {
      new PublicKey(router.query.pubkey);
      setRouterPubkey(new PublicKey(router.query.pubkey));
    } catch (error) {}
  }, [router.query.pubkey]);

  const selectMint = useCallback(
    (mint: PublicKey | undefined) => {
      if (mint) {
        router.query.mintId = mint?.toBase58();
      } else {
        const { mintId, ...rest } = router.query;
        router.query = rest;
      }
      router.push(router);
    },
    [router]
  );

  const mintId = useMemo(() => router.query.mintId, [router.query]);

  const mint = usePublicKeyOrNull(mintId as string);

  return (
    <>
      <Head>
        <title>LibrePlex - Wallet {router.query.pubkey}</title>
      </Head>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          margin: "92px 58px",
        }}
      >
        {!mint && (
          <Heading
            size={"4xl"}
            className="gradientText"
            style={{ opacity: 0.7 }}
          >
            {router.query.pubkey === publicKey?.toBase58()
              ? "My Wallet"
              : `${router.query.pubkey?.slice(
                  0,
                  4
                )}...${router.query.pubkey?.slice(
                  router.query.pubkey.length - 4
                )}`}
          </Heading>
        )}

        {routerPubkey ? (
          <WalletGallery
            publicKey={routerPubkey}
            isOwner={router.query.pubkey === publicKey?.toBase58()}
          />
        ) : (
          <Center style={{ minHeight: "500px" }}>
            <Text>Must be valid public key</Text>
          </Center>
        )}
      </div>
    </>
  );
};

export default Home;
