import { Box, Center, Checkbox, Td, Text, Tr } from "@chakra-ui/react";
import { ImageUploader } from "components/shadowdrive/ImageUploader";
import { Collection } from "query/collections";
import { Metadata } from "query/metadata";
import { CopyPublicKeyButton } from "../buttons/CopyPublicKeyButton";
import { IRpcObject } from "../executor/IRpcObject";
import { NftMetadataDisplay } from "./NftMetadataDisplay";

export const MetadataItem = ({
  item,
  collection,
}: {
  item: IRpcObject<Metadata>;
  collection: IRpcObject<Collection>;
}) => {
  return (
    <Tr>
      <Td borderLeft={`10px solid ${false ? "teal" : "none"}`}>
        <Center>
          <Checkbox
            isChecked={false}
            onChange={(e) => {
              // toggleSelectedCollection(item.pubkey, e.currentTarget.checked);
            }}
          />
        </Center>
      </Td>
      <Td>
        <Box>
          {item.item.renderModeData.length > 0 &&
            item.item.renderModeData[0].url && (
              <ImageUploader
                width="150px"
                
                linkedAccountId={item.item.mint.toBase58()}
                fileId={"file.png"}
                afterUpdate={() => {}}
                currentImage={item.item.renderModeData[0].url.url}
              />
            )}
        </Box>
      </Td>

      <Td>
        <Box display="flex" flexDir={"column"} alignItems="center" rowGap={3}>
          <Text fontSize="3xl">{item.item.name}</Text>
          <CopyPublicKeyButton publicKey={item.item.mint.toBase58()} />
          {item.item.nftMetadata && (
            <NftMetadataDisplay
              nftMetadata={item.item.nftMetadata}
              collection={collection}
            />
          )}
        </Box>
      </Td>

      {/* <RenderModeDisplay renderModes={item.item.renderModeData} /> */}

      {/* )} */}
    </Tr>
  );
};
