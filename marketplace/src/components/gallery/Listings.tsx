import { Box, Text } from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React from "react";


import { useListingsByLister } from "shared-ui";
export const ListingGallery = ({ publicKey }: { publicKey: PublicKey }) => {
  const { connection } = useConnection();
  const { data } = useListingsByLister(publicKey, connection);

  return (
    <Box p={20} display="flex" flexDirection="column">
      <Text>Listings: {data.length}</Text>
      {/* {data.filter(item=>item.item).map((item, idx) => (
        <MintCard key={idx} tokenAccount={{pubkey: item.pubkey, item: item.item!}}/>
      ))} */}
    </Box>
  );
};
