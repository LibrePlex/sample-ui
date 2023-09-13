import { Box, Center, Checkbox, Td, Text, Tr } from "@chakra-ui/react";
import { ImageUploader } from "@app/components/shadowdrive/ImageUploader";
import { Group, IRpcObject, getMetadataExtendedPda } from  "@libreplex/shared-ui";
import { Metadata, useMetadataById } from  "@libreplex/shared-ui";
import { CopyPublicKeyButton } from  "@libreplex/shared-ui";
import { NftMetadataDisplay } from "./ExtendedMetadataDisplay";
import { PublicKey } from "@solana/web3.js";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useConnection } from "@solana/wallet-adapter-react";

export const MetadataItem = ({
  item,
  collection,
  selectedMetadataKeys,
  toggleSelectedMetadata,
}: {
  item: IRpcObject<Metadata>;
  collection: IRpcObject<Group>;
  selectedMetadataKeys: Set<PublicKey>,
  toggleSelectedMetadata: (pubkey: PublicKey, b: boolean)=> any;
}) => {

  
  const {connection} = useConnection()

  const metadataExtendedKey = useMemo(()=>getMetadataExtendedPda(item.pubkey)[0],[item])

  // const metadataExtended = useMetadataExtendedById(
  //   metadataExtendedKey,
  //   connection
  // );

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
