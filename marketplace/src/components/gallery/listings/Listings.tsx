import { Box, Button, Center, HStack, Heading, VStack, Text } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useContext, useMemo, useState } from "react";
import { IRpcObject, useAllListings } from  "@libreplex/shared-ui";
import { GroupDisplay } from "./collections/GroupDisplay";


import {LibreplexShop} from "@libreplex/idls/lib/types/libreplex_shop"
import { IdlAccounts } from "@coral-xyz/anchor";
import CollectionCard from "./collections/CollectionCard";

type Listing = {
  item: IdlAccounts<LibreplexShop>["listing"]
};

type Props = {
  data: Listing[];
}

function ListingGallery({data}: Props){


  const { publicKey } = useWallet();
  // const listingsByGroup: any[] = useMemo(()=>[],[]);
  const listingsByGroup = useMemo(() => {
    const _listingsByGroup: {
      [key: string]: (Listing & { executed?: boolean })[];
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
            (a.item.lister.equals(publicKey) ? 0 : 1000) -
            (b.item.lister.equals(publicKey) ? 0 : 1000)
        );
      }
    }

    return _listingsByGroup;
  }, [data, publicKey]);

  const collectionKeys = useMemo(
    () => Object.keys(listingsByGroup).sort((a, b) => a.localeCompare(b)),
    [listingsByGroup]
  );

  return publicKey ? (
    <Box
      my={10}
      // p={20}
      display="flex"
      flexDirection="column"
      alignItems={"center"}
      height="100%"
    >
      <HStack mt={5} width={'100%'} height={'100%'} gap={8} wrap="wrap">

        {/* <Text color='white'>{JSON.stringify(collectionKeys)}</Text> */}
        {/* <Text color='white'>{JSON.stringify(listingsByGroup)}</Text> */}
        {collectionKeys.map((collectionKey, idx) => (
          <CollectionCard
          key={idx}
          collectionKey={collectionKey.length > 0 ? new PublicKey(collectionKey): null}
          totalListings={listingsByGroup[collectionKey].length}
          />
          // <GroupDisplay
          //   groupKey={groupKey.length > 0 ? new PublicKey(groupKey): null}
          //   listings={listingsByGroup[groupKey]}
          //   key={idx}
          // ></GroupDisplay>
        ))}
      </HStack>
    </Box>
  ) : (
    <Center height="100%">
      Please connect your wallet to view / manage listings
    </Center>
  );
};

export default ListingGallery