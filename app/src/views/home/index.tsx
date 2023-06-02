// Next, React
import { FC, useEffect, useState } from "react";
import Link from "next/link";

// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

// Components
import { RequestAirdrop } from "../../components/RequestAirdrop";
import pkg from "../../../package.json";

// Store
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";
import { Box, Heading, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";

export const HomeView: FC = ({}) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className="mt-6">
          <div className="text-sm font-normal align-bottom text-right text-slate-600 mt-4">
            v{pkg.version}
          </div>
          <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
            LibrePlex
          </h1>
        </div>
        <h4 className="md:w-full text-2x1 md:text-4xl text-center text-slate-300 my-2">
          {/* <p>Unleash the full power of blockchain with Solana and Next.js 13.</p> */}
          <p className="text-slate-500 text-2x1 leading-relaxed">
            The mission of LibrePlex is to provide a community-driven, open
            license protocol to the Solana SPL Token and NFT community.
          </p>
        </h4>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-indigo-500 rounded-lg blur opacity-40 animate-tilt"></div>
          <div className="max-w-xl mx-auto mockup-code bg-primary border-2 border-[#5252529f] p-6 px-10 my-2">
            <pre data-prefix=">">
              <code className="truncate">
                {`git clone git@github.com:LibrePlex/metadata.git`}{" "}
              </code>
            </pre>
          </div>
        </div>

        <Box
          p={"10px"}
          sx={{
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            alignContent: 'center'
          }}
        >
          <Heading size="md" my="2">
            Want to help out?
          </Heading>
          <Text>
            We are NOT a team, but a collection of teams across the Solana
            ecosystem. We are independent of commercial interests. We depend on
            contributions from technologists, influencers, designers,
            documenters and anybody else who wants to lend a hand. Despite and
            because of our independence, we have already secured the support of
            wallets, utility providers and launchpads across Solana.
          </Text>
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center" columnGap={2}>
          <LinkBox as="article" maxW="sm" p="5" borderWidth="1px" rounded="md">
            <Heading size="md" my="2">
              <LinkOverlay href="https://discord.gg/wmpfBZhd">
                Join us on discord:
              </LinkOverlay>
            </Heading>
            <Text></Text>

            <Text>https://discord.gg/wmpfBZhd</Text>
          </LinkBox>
          <LinkBox as="article" maxW="sm" p="5" borderWidth="1px" rounded="md">
            <Heading size="md" my="2">
              <LinkOverlay href="https://discord.gg/wmpfBZhd">
                Follow us on twitter
              </LinkOverlay>
            </Heading>
            <Text></Text>

            <Text>https://discord.gg/wmpfBZhd</Text>
          </LinkBox>
        </Box>
        <Box sx={{width :"100%", display :"flex", justifyContent :"center"}}><h3 style={{ paddingTop: "30px" }}>Free DEV SOL below!</h3></Box>
        <div className="flex flex-col mt-2">
          <RequestAirdrop />
          <h4 className="md:w-full text-2xl text-slate-300 my-2">
            {wallet && (
              <div className="flex flex-row justify-center">
                <div>{(balance || 0).toLocaleString()}</div>
                <div className="text-slate-600 ml-2">SOL</div>
              </div>
            )}
          </h4>
        </div>
      </div>
    </div>
  );
};
