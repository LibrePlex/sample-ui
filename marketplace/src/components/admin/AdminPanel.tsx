import { Box } from "@chakra-ui/react";
import React, { useContext } from "react";
import { PublicKey } from "@solana/web3.js";
import { useListingGroupsByAdmin } from "shared-ui/src/sdk/query";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ShopOwnerContext } from "../ShopOwnerContext";

export const ListingGroupGallery = () => {
  const { connection } = useConnection();
  const { ownerPublicKey } = useContext(ShopOwnerContext);
  const { data } = useListingGroupsByAdmin(ownerPublicKey, connection);
  return <Box display="flex">{data.length}</Box>;
};
