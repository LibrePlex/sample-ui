import { Box, HStack, Heading, VStack, Text } from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";


import { useMetadataGroupedByCollection } from  "@libreplex/shared-ui";
import { MintCard } from "../../mintcard/MintCard";
import { useEffect } from "react";
export const WalletGallery = ({ publicKey, onSelectMint }: { 
  onSelectMint: (mint: PublicKey) => any,
  publicKey: PublicKey }) => {
  const { connection } = useConnection();

  const { data: groupedMetadata } = useMetadataGroupedByCollection(
    publicKey,
    connection
  );

  useEffect(()=>{
    console.log({groupedMetadata})
  },[groupedMetadata])

  return (
    <Box p={20} display="flex" flexDirection="row" flexWrap={"wrap"} gap={2}>
      <VStack align="start" gap={16}>
      <Box ><Heading size={'md'}>Wallet contents</Heading></Box>
        {groupedMetadata.map((item, idx) => (
          <VStack key={idx} align="start" gap={8}>
            <Heading>{item.collection?.item.name}</Heading>
            <HStack wrap={"wrap"}>
              {item.items.map((item, idx2) => (
                <MintCard key={idx2} onSelectMint={onSelectMint} mint={item.metadata.item.mint} />
              ))}
            </HStack>
          </VStack>
        ))}
      </VStack>
    </Box>
  );
};
