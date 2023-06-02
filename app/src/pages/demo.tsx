"use client";

import {
  Box,
  Heading,
  LinkBox,
  LinkOverlay,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { SendTransaction } from "components/SendTransaction";
import { SendVersionedTransaction } from "components/SendVersionedTransaction";
import { SignMessage } from "components/SignMessage";
import Link from "next/link";

const Demo = () => {
  // Here is a wallet adapter
  const wallet = useWallet();

  // Here is an RPC connection
  const connection = useConnection();

  // The Solita client can be imported via yarn workspace

  return (
    <Box
      w={"100vw"}
      h={"100%"}
      display={"flex"}
      flexDirection={"column"}
      sx={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        rowGap={3}
      >
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Demo
        </h1>

        <p className="text-2xl">
          WEN??? Over the coming days, this space will host reference web implementations built on top of
          the LibrePlex contracts. Source repos below:
        </p>

        
        <Box display="flex" columnGap={2}>
          <LinkBox as="article" maxW="sm" p="5" borderWidth="1px" rounded="md">
            <Heading size="md" my="2">
              <LinkOverlay href="https://github.com/LibrePlex/metadata">
                Contracts
              </LinkOverlay>
            </Heading>
            <Text>Released under MIT License</Text>
            <Text>
              Click here for the repo!
            </Text>
            <Text>https://github.com/LibrePlex/metadata</Text>
          </LinkBox>
          <LinkBox as="article" maxW="sm" p="5" borderWidth="1px" rounded="md">
            <Heading size="md" my="2">
              <LinkOverlay href="https://github.com/LibrePlex/sample-ui">
                Reference UI (this website)
              </LinkOverlay>
            </Heading>
            <Text>Released under Apache 2.0 License</Text>
            <Text>
              Click here for the repo!
            </Text>
            <Text>https://github.com/LibrePlex/sample-ui</Text>
          </LinkBox>
        </Box>

        {/* <div className="text-center">
          <SignMessage />
          <SendTransaction />
          <SendVersionedTransaction />
        </div>

        <Text>Functionality</Text>

        <UnorderedList>
          <ListItem>Create NFT Collection</ListItem>
          <ListItem>Delete NFT Collection</ListItem>
          <ListItem>Create SPL Collection</ListItem>
          <ListItem>Delete SPL Collection</ListItem>
          <ListItem>Create NFT Metadata</ListItem>
          <ListItem>Delete NFT Metadata</ListItem>
          <ListItem>Create SPL Metadata</ListItem>
          <ListItem>Delete SPL Metadata</ListItem>
          <ListItem>Verify (sign) creator</ListItem>
          <ListItem>TBD: Unverify creator</ListItem>
        </UnorderedList>

        <UnorderedList>
          <ListItem>Delegation</ListItem>
          <ListItem>etc etc</ListItem>
        </UnorderedList> */}
      </Box>
    </Box>
  );
};

export default Demo;
