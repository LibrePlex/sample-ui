import { Box, Heading, ICollapse, Text } from "@chakra-ui/react";
import { IRpcObject } from "components/executor/IRpcObject";
import { Collection } from "query/collections";
import { Dispatch, SetStateAction } from "react";
import { useMetadataByCollection } from "../../../query/metadata";
import { useConnection } from "@solana/wallet-adapter-react";
import { MetadataCard } from "components/metadata/Metadata";

export const CollectionViewer = ({
  collection,
  setCollection,
}: {
  collection: IRpcObject<Collection> | undefined;
  setCollection: Dispatch<SetStateAction<IRpcObject<Collection>>>;
}) => {
  const { connection } = useConnection();
  const { data: items } = useMetadataByCollection(
    collection?.pubkey,
    connection
  );
  return (
    <Box>
      <Text>Items ({items?.length ?? "-"})</Text>
      <Box display="flex" gap={2} flexWrap={"wrap"}>
        {items?.map((item) => (
          <MetadataCard item={item} collection={collection}/>
        ))}
      </Box>
    </Box>
  );
};
