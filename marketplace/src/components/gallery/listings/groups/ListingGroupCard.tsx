import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { useContext, useEffect, useMemo } from "react";
import { IRpcObject, ListingGroup } from "shared-ui";
import { useListingFiltersByGroup } from "shared-ui/src/sdk/query";
import { ShopOwnerContext } from "../../../ShopOwnerContext";
import { DeleteListingGroupTransactionButton } from "../admin/DeleteListingGroupTransactionButton";
import { ManageListingFilterModal } from "../admin/ManageListingFilterModal";
import { GroupDisplay } from "./GroupDisplay";
import { PublicKey } from "@solana/web3.js";

export const ListingGroupCard = ({
  listingGroup,
  isSelected,
  setSelectedGroupKey,
}: {
  setSelectedGroupKey: (p: PublicKey) => any;
  isSelected: boolean;
  listingGroup: IRpcObject<ListingGroup>;
}) => {
  const { connection } = useConnection();

  const { data: filters } = useListingFiltersByGroup(
    listingGroup.pubkey,
    connection
  );

  const groupFilter = useMemo(
    () => filters.find((item) => item.item?.filterType.group),
    [filters]
  );

  const { ownerPublicKey } = useContext(ShopOwnerContext);

  const { publicKey } = useWallet();

  const amIAdmin = useMemo(
    () => publicKey?.equals(ownerPublicKey),
    [publicKey, ownerPublicKey]
  );

  return (
    <VStack
      minWidth={"200px"}
      maxWidth={"200px"}
      minHeight={"250px"}
      sx={{
        overflow: "hidden",
        border: `1px solid ${isSelected ? "teal" : "none"}`,
        borderRadius: "10px",
        cursor: "pointer",
      }}
      onClick={() => {
        setSelectedGroupKey(listingGroup.pubkey);
      }}
    >
      <Box p={2}>
        <Heading size="md" noOfLines={1}>
          {listingGroup.item.name}
        </Heading>
      </Box>
      {groupFilter?.item?.filterType.group?.pubkey && (
        <GroupDisplay groupKey={groupFilter?.item?.filterType.group?.pubkey} />
      )}
      {listingGroup &&
        publicKey?.equals(ownerPublicKey) &&
        listingGroup.item.filterCount > 0 && (
          <ManageListingFilterModal listingGroup={listingGroup} />
        )}
      {listingGroup.deleted ? (
        <Text>Deleted</Text>
      ) : (
        amIAdmin &&
        listingGroup.item.filterCount === 0 && (
          <>
            {listingGroup.deleted ? (
              <Text>Deleted</Text>
            ) : (
              <DeleteListingGroupTransactionButton
                params={{
                  listingGroup: listingGroup.pubkey,
                }}
                formatting={{}}
              />
            )}
          </>
        )
      )}
    </VStack>
  );
};
