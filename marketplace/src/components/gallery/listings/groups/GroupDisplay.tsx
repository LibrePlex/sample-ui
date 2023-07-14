import { MintCard } from "@/components/mintcard/MintCard";
import { HStack, Heading, Skeleton, VStack, Text } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React from "react";
import { IRpcObject, Listing, useGroupById } from "shared-ui";
import { ListingAction } from "../ListingAction";

export const GroupDisplay = ({
  groupKey,
  listings,
}: {
  groupKey: PublicKey;
  listings: (IRpcObject<Listing> & { executed?: boolean })[];
}) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const group = useGroupById(groupKey, connection);

  return (
    <VStack align="start">
      <HStack sx={{ w: "100%" }}>
        {group?.item?.url.length > 0 ? (
          <img
            src={group?.item?.url}
            style={{ minWidth: "135px", maxWidth: "135px", aspectRatio: "1/1" }}
          />
        ) : (
          <Skeleton
            style={{ minWidth: "135px", maxWidth: "135px", aspectRatio: "1/1" }}
          />
        )}
        <VStack align={"end"} sx={{ w: "100%" }}>
          <Heading size="md">Group: {group?.item.name}</Heading>
          <Heading size="md">Listings for g({listings.length})</Heading>
        </VStack>
      </HStack>

      <HStack wrap={"wrap"}>
        {listings.map(
          (item, idx2) => (
            <MintCard
              sx={{ position: "relative" }}
              key={idx2}
              mint={item.item?.mint!}
            >
              <ListingAction
                publicKey={publicKey}
                listing={{ ...item, item: item.item! }}
              />
            </MintCard>
          )
          // <>{item.pubkey.toBase58()}</>
        )}
      </HStack>
    </VStack>
  );
};
