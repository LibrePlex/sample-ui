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
import { Demo } from "components/demo/Demo";
import Link from "next/link";

const DemoPage = () => {
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
      <Demo/>
    </Box>
  );
};

export default DemoPage;
