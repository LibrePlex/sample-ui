import React, { useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useCollectionById } from "@libreplex/shared-ui";
import { PublicKey } from "@solana/web3.js";
import { VStack, Skeleton, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";

type Props = {
  collectionKey: PublicKey;
  totalListings: number;
};

const textMotion = {
  default: {
    color: "#ffffff",
  },
  hover: {
    color: "#9448FF",
  },
};

function CollectionCard({ collectionKey, totalListings }: Props) {
  const { connection } = useConnection();
  const collection = useCollectionById(collectionKey, connection);
  const [hasError, setHasError] = useState(false);

  return (
    <VStack align="flex-start">
      <Link href={`listings/${collectionKey}`}>
        <VStack
          align="flex-start"
          as={motion.div}
          initial="default"
          whileHover="hover"
        >
          {collection?.item.url.length && !hasError ? (
            <img
              src={collection.item.url}
              style={{
                minWidth: 200,
                maxWidth: 200,
                aspectRatio: "1/1",
                borderRadius: 8,
              }}
              onError={(e) => {
                setHasError(true);
              }}
            />
          ) : !hasError ? (
            <Skeleton
              style={{
                minWidth: 200,
                maxWidth: 200,
                aspectRatio: "1/1",
                borderRadius: 8,
              }}
            />
          ) : (
            <div
              style={{
                minWidth: 200,
                maxWidth: 200,
                aspectRatio: "1/1",
                borderRadius: 8,
                background:
                  "linear-gradient(45deg, var(--primary-color), var(--secondary-color))",
              }}
            ></div>
          )}
          <Heading
            title={collection?.item.name ?? "-"}
            as={motion.p}
            size="md"
            noOfLines={1}
            variants={textMotion}
          >
            {" "}
            {collection?.item.name ?? "-"}
          </Heading>
        </VStack>
      </Link>

      <VStack align="start" gap={0}>
        <Text style={{ fontSize: 12 }} color="gray.400">
          Total: {totalListings}
        </Text>
        <Link href={`/user/${collection?.item.creator.toBase58()}`}>
          <Text style={{ fontSize: 12 }} color="gray.400">
            Created by: {collection?.item.creator.toBase58().slice(0, 4)}...
            {collection?.item.creator
              .toBase58()
              .slice(collection?.item.creator.toBase58().length - 4)}
          </Text>
        </Link>

      </VStack>
    </VStack>
  );
}

export default CollectionCard;
