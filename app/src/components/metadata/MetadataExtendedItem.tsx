import { Box, Center, Checkbox, Td, Text, Tr } from "@chakra-ui/react";
import { ImageUploader } from "@/components/shadowdrive/ImageUploader";
import { Group } from "shared-ui";
import { Metadata, useMetadataById } from "shared-ui";
import { CopyPublicKeyButton } from "shared-ui";
import { IRpcObject } from "../executor/IRpcObject";
import { NftMetadataDisplay } from "./ExtendedMetadataDisplay";
import { PublicKey } from "@solana/web3.js";
import { Dispatch, SetStateAction, useMemo } from "react";
import { MetadataExtended } from "shared-ui";
import { useConnection } from "@solana/wallet-adapter-react";

export const MetadataExtendedItem = ({
  item,
  collection,
  selectedMetadataKeys,
  toggleSelectedMetadata,
}: {
  item: IRpcObject<MetadataExtended>;
  collection: IRpcObject<Group>;
  selectedMetadataKeys: Set<PublicKey>,
  toggleSelectedMetadata: (pubkey: PublicKey, b: boolean)=> any;
}) => {

  
  const {connection} = useConnection()

  const metadata = useMetadataById(
    item.item.metadata,
    connection
  );

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
          <Text fontSize="3xl">{metadata.item.name}</Text>
          <CopyPublicKeyButton publicKey={metadata.item.mint.toBase58()} />
            <NftMetadataDisplay
              attributes={item.item.attributes}
              collection={collection}
            />
        </Box>
      </Td>

      {/* <RenderModeDisplay renderModes={item.item.renderModeData} /> */}

      {/* )} */}
    </Tr>
  );
};
