import { Box, Center, Checkbox, Td, Text, Tr } from "@chakra-ui/react";
import {
  CopyPublicKeyButton,
  Collection,
  IRpcObject,
  Metadata,
  getMetadataExtendedPda,
} from "@libreplex/shared-ui";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";

export const MetadataItem = ({
  item,
  collection,
  selectedMetadataKeys,
  toggleSelectedMetadata,
}: {
  item: IRpcObject<Metadata>;
  collection: IRpcObject<Collection>;
  selectedMetadataKeys: Set<PublicKey>;
  toggleSelectedMetadata: (pubkey: PublicKey, b: boolean) => any;
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
          {/* {metadataExtended && (
            <NftMetadataDisplay
              attributes={metadataExtended.item.attributes}
              collection={collection}
            />
          )} */}
        </Box>
      </Td>

      {/* <RenderModeDisplay renderModes={item.item.renderModeData} /> */}

      {/* )} */}
    </Tr>
  );
};
