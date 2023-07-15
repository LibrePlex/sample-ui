import { Box, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useMemo } from "react";

import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

import { useTokenAccountsByOwner } from "shared-ui";
import { MintCard } from "../../mintcard/MintCard";
import { WalletAction } from "./walletcard/WalletAction";
import { CreateListingModal } from "./walletcard/CreateListingModal";
import { useGroupedMetadataByOwner } from "shared-ui";
export const WalletGallery = ({ publicKey }: { publicKey: PublicKey }) => {
  const { connection } = useConnection();

  const { data: groupedMetadata } = useGroupedMetadataByOwner(
    publicKey,
    connection
  );

  return (
    <Box p={20} display="flex" flexDirection="row" flexWrap={"wrap"} gap={2}>
      <VStack align='start' gap={16}>
        {groupedMetadata.map((item, idx) => (
          <VStack key={idx} align='start' gap={8}>
            <Heading>{item.group?.item.name}</Heading>
            <HStack wrap={'wrap'}>
            {item.items.map((item, idx2) => (
              <MintCard key={idx2} mint={item.item.mint} />
            ))}
            </HStack>
          </VStack>
        ))}
      </VStack>
    </Box>
  );
};
