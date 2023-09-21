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
    <VStack
    gap={16}
    alignItems="flex-start"
    justifyContent="center"
    style={{marginTop: 64}}
    width={'100%'}
    >
    
    {
      groupedMetadata.map((item, id) => (
        <VStack
        key={id}
        gap={8}
        alignItems="flex-start"
        justifyContent="center"
        width={'100%'}
        >

          <VStack
          alignItems="flex-start"
          >
            <Heading>{item.collection?.item.name} <span style={{color:'gray'}}>({item.items.length})</span></Heading>
            <span style={{fontSize: 12, color: 'gray'}}>Created by: {item.collection.item.creator.toBase58().slice(0,4)}...{item.collection.item.creator.toBase58().slice(item.collection.item.creator.toBase58().length-4)}</span>
          </VStack>

          <HStack
          gap={8}
          alignItems="flex-start"
          justifyContent="flex-start"
          flexWrap="wrap"
          >

            {item.items.map((item, id2) => (
              <MintCard key={id2} onSelectMint={onSelectMint} mint={item.metadata.item.mint} />
            ))}
          
          </HStack>
        
        </VStack>
      ))
    }


    </VStack>
  )
}
