import { Box, Button, Center, HStack, Heading, VStack, Text } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useContext, useMemo, useState } from "react";
import { IRpcObject, useAllListings } from  "@libreplex/shared-ui";
import { GroupDisplay } from "./groups/GroupDisplay";


import {LibreplexShop} from "@libreplex/idls/lib/types/libreplex_shop"
import { IdlAccounts } from "@coral-xyz/anchor";
type Listing = IdlAccounts<LibreplexShop>["listing"];
export const ListingGallery = () => {
  const { connection } = useConnection();

  const { data, refetch } = useAllListings(connection);

  const { publicKey } = useWallet();
  // const listingsByGroup: any[] = useMemo(()=>[],[]);
  const listingsByGroup = useMemo(() => {
    const _listingsByGroup: {
      [key: string]: (IRpcObject<Listing> & { executed?: boolean })[];
    } = {};
    for (const a of data) {
      if (_listingsByGroup[a.item.collection?.toBase58() ?? ""]) {
        _listingsByGroup[a.item.collection?.toBase58() ?? ""].push(a);
      } else {
        _listingsByGroup[a.item.collection?.toBase58() ?? ""] = [a];
      }
    }

    if (publicKey) {
      for (const key of Object.keys(_listingsByGroup)) {
        // my listings first
        _listingsByGroup[key] = _listingsByGroup[key].sort(
          (a, b) =>
            ((a.item as any).lister .equals(publicKey) ? 0 : 1000) -
            ((b.item as any).lister.equals(publicKey) ? 0 : 1000)
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
        {/* <Text color='white'>{JSON.stringify(groupKeys)}</Text>
        <Text color='white'>{JSON.stringify(listingsByGroup)}</Text> */}
        {groupKeys.map((groupKey, idx) => (
          <GroupDisplay
            groupKey={groupKey.length > 0 ? new PublicKey(groupKey): null}
            listings={listingsByGroup[groupKey]}
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
