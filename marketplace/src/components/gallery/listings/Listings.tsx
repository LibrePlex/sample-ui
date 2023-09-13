import { Box, Button, Center, HStack, Heading, VStack } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useContext, useMemo, useState } from "react";
import { IRpcObject, Listing, useAllListings } from "@libreplex/shared-ui";
import { ShopOwnerContext } from "../../ShopOwnerContext";
import { GroupDisplay } from "./groups/GroupDisplay";
export const ListingGallery = () => {
  const { connection } = useConnection();

  const { data, refetch } = useAllListings(connection);

  const { publicKey } = useWallet();

  const listingsByGroup = useMemo(() => {
    const _listingsByGroup: {
      [key: string]: (IRpcObject<Listing> & { executed?: boolean })[];
    } = {};
    for (const a of data) {
      if (_listingsByGroup[a.item.group.toBase58() ?? ""]) {
        _listingsByGroup[a.item.group.toBase58() ?? ""].push(a);
      } else {
        _listingsByGroup[a.item.group.toBase58() ?? ""] = [a];
      }
    }

    if (publicKey) {
      for (const key of Object.keys(_listingsByGroup)) {
        // my listings first
        _listingsByGroup[key] = _listingsByGroup[key].sort(
          (a, b) =>
            (a.item.lister.equals(publicKey) ? 0 : 1000) -
            (b.item.lister.equals(publicKey) ? 0 : 1000)
        );
      }
    }

    return _listingsByGroup;
  }, [data, publicKey]);

  const groupKeys = useMemo(
    () => Object.keys(listingsByGroup).sort((a, b) => a.localeCompare(b)),
    [listingsByGroup]
  );

  return publicKey ? (
    <Box
      mb={10}
      p={20}
      display="flex"
      flexDirection="column"
      alignItems={"center"}
    >
      <VStack mt={5}>
        <Button onClick={()=>{
          refetch()
        }}>Refresh</Button>
        {groupKeys.map((key, idx) => (
          <GroupDisplay
            groupKey={new PublicKey(key)}
            listings={listingsByGroup[key]}
            key={idx}
          ></GroupDisplay>
        ))}
      </VStack>
    </Box>
  ) : (
    <Center height="100%">
      Please connect your wallet to view / manage listings
    </Center>
  );
};
