import { MintCard } from "@marketplace/components/mintcard/MintCard";
import { HStack, Heading, Skeleton, VStack, Text } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useState } from "react";
import { IRpcObject, useCollectionById } from "@libreplex/shared-ui";
import { ListingAction } from "../ListingAction";
import { IdlAccounts } from "@coral-xyz/anchor";
import { LibreplexShop } from "@libreplex/idls/lib/types/libreplex_shop";

export type Listing = IdlAccounts<LibreplexShop>["listing"];

export const GroupDisplay = ({
  groupKey,
  listings,
}: {
  groupKey: PublicKey | null;
  listings: (IRpcObject<Listing> & { executed?: boolean })[];
}) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const collection = useCollectionById(groupKey, connection);
  const [hasError, setHasError] = useState(false)

  return (
    <VStack
    align="start"
    width="100%"
    gap={4}
    >

        {collection?.item?.url.length && !hasError ? 
          <img
            src={collection?.item?.url}
            style={{ minWidth: "135px", maxWidth: "135px", aspectRatio: "1/1", borderRadius: 8 }}
            onError={(e)=>{setHasError(true)}}
          />
        : !hasError ?
          <Skeleton
              style={{ minWidth: "135px", maxWidth: "135px", aspectRatio: "1/1", borderRadius: 8 }}
            />
        :
        <div style={{minWidth: 135, maxWidth: 135, aspectRatio: "1/1", borderRadius: 8, background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))'}}></div>
        }

        {/* <Heading
        color="#4A5568"
        letterSpacing="wider"
        fontSize="xs"
        >
          LISTINGS
        </Heading> */}


        <HStack wrap={"wrap"}>
          {listings.map((item, idx2) => (
            <MintCard
              sx={{ position: "relative" }}
              key={idx2}
              mint={(item.item as any)?.mint!}
            >
              <ListingAction
                publicKey={publicKey}
                listing={{ ...item, item: item.item! }}
              />
            </MintCard>
          ))}
        </HStack>
      


    </VStack>
  )

  return <VStack align="start">
      <HStack sx={{ w: "100%" }}>

        {/* <Text>{JSON.stringify(group?.item)}</Text>
        <Text>{groupKey?.toBase58()}</Text> */}
        {collection?.item?.url.length > 0 ? (
          <img
            src={collection?.item?.url}
            style={{ minWidth: "135px", maxWidth: "135px", aspectRatio: "1/1" }}
          />
        ) : (
          <Skeleton
            style={{ minWidth: "135px", maxWidth: "135px", aspectRatio: "1/1" }}
          />
        )}
        <VStack align={"end"} sx={{ w: "100%" }}>
          <Heading size="md">Collection: {collection?.item?.name}</Heading>
          <Heading size="md">
            Listings ({listings.length})
          </Heading>
        </VStack>
      </HStack>

      <HStack wrap={"wrap"}>
        {listings.map((item, idx2) => (
          <MintCard
            sx={{ position: "relative" }}
            key={idx2}
            mint={(item.item as any)?.mint!}
          >
            <ListingAction
              publicKey={publicKey}
              listing={{ ...item, item: item.item! }}
            />
          </MintCard>
        ))}
      </HStack>
    </VStack>
 
};
