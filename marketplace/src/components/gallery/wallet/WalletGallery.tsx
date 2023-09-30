import { HStack, Heading, VStack } from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import {
  SendMintButton,
  useMetadataGroupedByCollection,
} from "@libreplex/shared-ui";
import { useEffect } from "react";
import { MintCard } from "../../mintcard/MintCard";
import { ListMintButton } from "./walletcard/ListMintButton";

export const WalletGallery = ({
  publicKey,
  isOwner,
}: {
  isOwner: boolean;
  publicKey: PublicKey;
}) => {
  const { connection } = useConnection();

  const { data: groupedMetadata } = useMetadataGroupedByCollection(
    publicKey,
    connection
  );

  useEffect(() => {
    console.log({ groupedMetadata });
  }, [groupedMetadata]);

  return (
    <VStack
      gap={16}
      alignItems="flex-start"
      justifyContent="center"
      style={{ marginTop: 64 }}
      width={"100%"}
    >
      {groupedMetadata.map((item, id) => (
        <VStack
          key={id}
          gap={8}
          alignItems="flex-start"
          justifyContent="center"
          width={"100%"}
        >
          <VStack alignItems="flex-start">
            <Heading>
              {item.collection?.item.name}{" "}
              <span style={{ color: "gray" }}>({item.items.length})</span>
            </Heading>
            <span style={{ fontSize: 12, color: "gray" }}>
              Created by: {item.collection.item.creator.toBase58().slice(0, 4)}
              ...
              {item.collection.item.creator
                .toBase58()
                .slice(item.collection.item.creator.toBase58().length - 4)}
            </span>
          </VStack>

          <HStack
            gap={8}
            alignItems="flex-start"
            justifyContent="flex-start"
            flexWrap="wrap"
          >
            {item.items.map((item, id2) => (
              <MintCard key={id2} mint={item.metadata.item.mint}>
                <HStack>
                  {isOwner && <ListMintButton item={item.tokenAccount} />}
                  {isOwner && <SendMintButton item={item.tokenAccount} />}
                </HStack>
              </MintCard>
            ))}
          </HStack>
        </VStack>
      ))}
    </VStack>
  );
};
