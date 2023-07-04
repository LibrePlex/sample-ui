import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { IRpcObject, useMetadataById } from "shared-ui";
import { RawAccount } from "@solana/spl-token";
import React from "react";
import { PublicKey } from "@solana/web3.js";
import { useMetadataByMintId } from "shared-ui/src/sdk/query/metadata";
import { Box, Button, HStack, Heading, Text } from "@chakra-ui/react";
import { AssetDisplay } from "./assetdisplay/AssetDisplay";

export const MintCard = ({
  mint,
  mintId,
}: {
  mint: IRpcObject<RawAccount | null>;
  mintId: PublicKey;
}) => {
  const { connection } = useConnection();
  const metadata = useMetadataByMintId(mintId, connection);
  return (
    <Box maxW={'300px'}>
      {metadata?.item?.asset && <AssetDisplay asset={metadata.item?.asset} />}
      <HStack justifyContent={'space-between'} p={2}>
        <Heading>{metadata?.item?.name}</Heading>
        <Button>List</Button>
      </HStack>
    </Box>
  );
};
