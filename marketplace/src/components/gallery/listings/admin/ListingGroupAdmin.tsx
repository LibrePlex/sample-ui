import { VStack } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { CreateListingGroupModal } from "./CreateListingGroupModal";

export const ListingGroupAdmin = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  // const { data } = useListingGroupsByAdmin(publicKey, connection);

  return (
    <VStack>
      <CreateListingGroupModal />
      {/* <ListingGroupSelector /> */}
    </VStack>
  );
};
