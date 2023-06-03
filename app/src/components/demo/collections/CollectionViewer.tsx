import {
  Box,
  Heading,
  ICollapse,
  Table,
  TableContainer,
  Tbody,
  Text,
} from "@chakra-ui/react";
import { IRpcObject } from "components/executor/IRpcObject";
import { Collection } from "query/collections";
import { Dispatch, SetStateAction } from "react";
import { useMetadataByCollection } from "../../../query/metadata";
import { useConnection } from "@solana/wallet-adapter-react";
import { MetadataItem as MetadataItem } from "components/metadata/MetadataItem";
import { AddMetadataButton } from "./metadatadialog/AddMetadataButton";

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
    <Box pt={5} sx={{width: "100%", height :"100%"}}>
      <Box display="flex" alignItems="center" columnGap={3} sx={{width: "100%"}}>
        <Heading>Items ({items?.length ?? "-"})</Heading>

        <AddMetadataButton size="sm" collection={collection} />
      </Box>
      <TableContainer
        sx={{ maxHeight: "100vh", overflow: "auto", width: "100%", height :"100%" }}
      >
        <Table>
          <Tbody>
            {items?.map((item, idx) => (
              <MetadataItem key={idx} item={item} collection={collection} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
