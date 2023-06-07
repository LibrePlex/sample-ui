import { Box, Center, Checkbox, Td, Text, Tr } from "@chakra-ui/react";
import { ImageUploader } from "components/shadowdrive/ImageUploader";
import { Group } from "query/group";
import { Metadata } from "query/metadata";
import { CopyPublicKeyButton } from "../buttons/CopyPublicKeyButton";
import { IRpcObject } from "../executor/IRpcObject";
import { NftMetadataDisplay } from "./ExtendedMetadataDisplay";
import { PublicKey } from "@solana/web3.js";
import { Dispatch, SetStateAction } from "react";
import { MetadataExtended } from "query/metadataExtended";

export const MetadataItem = ({
  item,
  extended,
  collection,
  selectedMetadataKeys,
  toggleSelectedMetadata,
}: {
  item: IRpcObject<Metadata>;
  extended: IRpcObject<MetadataExtended>|undefined,
  collection: IRpcObject<Group>;
  selectedMetadataKeys: Set<PublicKey>,
  toggleSelectedMetadata: (pubkey: PublicKey, b: boolean)=> any;
}) => {
  return (
    <Tr>
      <Td borderLeft={`10px solid ${false ? "teal" : "none"}`}>
        <Center>
          <Checkbox
            isChecked={selectedMetadataKeys.has(item.pubkey)}
            onChange={(e) => {
              toggleSelectedMetadata(item.pubkey, e.currentTarget.checked);
            }}
          />
        </Center>
      </Td>
      <Td>
        {/* <Box>
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
        </Box> */}
      </Td>

      <Td>
        <Box display="flex" flexDir={"column"} alignItems="center" rowGap={3}>
          <Text fontSize="3xl">{item.item.name}</Text>
          <CopyPublicKeyButton publicKey={item.item.mint.toBase58()} />
          {extended && (
            <NftMetadataDisplay
              attributes={extended.item.attributes}
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
