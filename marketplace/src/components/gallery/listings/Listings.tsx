import { Box, Center, HStack, Heading, Text } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { useContext, useMemo, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import {
  useAllListings,
  useListingsByGroup,
  useListingsByLister,
} from "shared-ui";
import { ShopOwnerContext } from "../../ShopOwnerContext";
import { MintCard } from "../../mintcard/MintCard";
import { ListingAction } from "./ListingAction";
import { ListingGroupAdmin } from "./admin/ListingGroupAdmin";
import { ListingGroupSelector } from "./groups/ListingGroupSelector";
export const ListingGallery = () => {
  const [selectedGroupKey, setSelectedGroupKey] = useState<PublicKey>();
  const { connection } = useConnection();
  const { ownerPublicKey } = useContext(ShopOwnerContext);

  const { data } = useListingsByGroup(selectedGroupKey, connection);

  const sortedListings = useMemo(
    () =>
      data.sort((a, b) =>
        a.pubkey.toBase58().localeCompare(b.pubkey.toBase58())
      ),
    [data]
  );

  const { publicKey } = useWallet();

  const amIAdmin = useMemo(
    () => publicKey?.equals(ownerPublicKey),
    [publicKey, ownerPublicKey]
  );

  return publicKey ? (
    <Box
      mb={10}
      p={20}
      display="flex"
      flexDirection="column"
      alignItems={"center"}
    >
      {amIAdmin && <ListingGroupAdmin />}
      <ListingGroupSelector
        selectedGroupKey={selectedGroupKey}
        setSelectedGroupKey={setSelectedGroupKey}
      />
      <Heading mt={5} size="md">
        Listings: {data.length}
      </Heading>
      <HStack mt={5}>
        {sortedListings
          .filter((item) => item.item && item.item?.mint)
          .map((item, idx) => (
            <MintCard
              sx={{ position: "relative" }}
              key={idx}
              mint={item.item?.mint!}
            >
              <ListingAction
                publicKey={publicKey}
                listing={{ ...item, item: item.item! }}
              />
            </MintCard>
          ))}
      </HStack>
    </Box>
  ) : (
    <Center height="100%">
      Please connect your wallet to view / manage listings
    </Center>
  );
};
