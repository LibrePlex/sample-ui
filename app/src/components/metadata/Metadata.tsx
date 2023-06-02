import { Box, Card, CardBody, Text } from "@chakra-ui/react";
import { IRpcObject } from "../executor/IRpcObject";
import { Metadata } from "query/metadata";
import { RenderModeDisplay } from "../RenderModeDisplay";
import { CopyPublicKeyButton } from "../buttons/CopyPublicKeyButton";
import { AttributesPanel } from "../demo/collections/editCollectionDialog/AttributesPanel";
import { NftMetadataDisplay } from "./NftMetadataDisplay";
import { Collection } from "query/collections";

export const MetadataCard = ({
  item,
  collection,
}: {
  item: IRpcObject<Metadata>;
  collection: IRpcObject<Collection>;
}) => {
  return (
    <Card sx={{ minWidth :"300px", maxWidth: "300px" }}>
      <CardBody>
        <Box display="flex" flexDirection={"column"}>
          <Text isTruncated>Name: {item.item.name}</Text>
          <Text>
            Mint Id:{" "}
            <CopyPublicKeyButton publicKey={item.item.mint.toBase58()} />
          </Text>
          <RenderModeDisplay renderModes={item.item.renderModeData} />
          {item.item.nftMetadata && (
            <NftMetadataDisplay
              nftMetadata={item.item.nftMetadata}
              collection={collection}
            />
          )}
        </Box>
      </CardBody>
    </Card>
  );
};
