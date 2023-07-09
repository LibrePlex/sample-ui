import { Box, Heading, VStack, Text } from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import React, { Dispatch, SetStateAction, useContext, useMemo, useState } from "react";
import { useListingGroupsByAdmin } from "shared-ui";
import { ShopOwnerContext } from "../../../ShopOwnerContext";
import { ListingGroupCard } from "./ListingGroupCard";
import { PublicKey } from "@solana/web3.js";

export const ListingGroupSelector = ({
  selectedGroupKey,
  setSelectedGroupKey

}:{
  selectedGroupKey: PublicKey | undefined,
  setSelectedGroupKey: Dispatch<SetStateAction<PublicKey | undefined>>

}) => {
  const { ownerPublicKey } = useContext(ShopOwnerContext);
  const { connection } = useConnection();

  const { data: listingGroups } = useListingGroupsByAdmin(
    ownerPublicKey,
    connection
  );

  const sortedGroups = useMemo(
    () =>
      listingGroups.sort((a, b) =>
        a.pubkey.toBase58().localeCompare(b.pubkey.toBase58())
      ),
    [listingGroups]
  );

 

  return (
    <VStack>
      <Heading size="lg">Listings</Heading>
      <Text maxWidth="500px">
        Listings in LibrePlex Shop are organised into groups. 
        You can use groups to split items by collection / attribute etc
        and (later) to filter by whitelisted sellers for finer-grained control.
      </Text>

      <Box gap={2} display="flex" flexWrap={"wrap"}>
        {sortedGroups
          .filter((item) => item.item)
          .map((item, idx) => (
            <ListingGroupCard
              setSelectedGroupKey={setSelectedGroupKey}
              isSelected={selectedGroupKey?.equals(item.pubkey) ?? false}
              key={idx}
              listingGroup={{ ...item, item: item.item! }}
            />
          ))}
      </Box>
    </VStack>
  );
};
