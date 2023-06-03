import {
  Box,
  Button,
  Center,
  Checkbox,
  Stack,
  Td,
  Text,
  Tr
} from "@chakra-ui/react";
import { CopyPublicKeyButton } from "components/buttons/CopyPublicKeyButton";
import { IRpcObject } from "components/executor/IRpcObject";
import { CollectionPermissions } from "query/permissions";

import { PublicKey } from "@solana/web3.js";
import { ImageUploader } from "components/shadowdrive/ImageUploader";
import { Collection } from "query/collections";
import { Dispatch, SetStateAction } from "react";
import useDeletedKeysStore from "stores/useDeletedKeyStore";
import { AttributesDialog } from "./AttributesDialog";
import { PermittedSignersDialog } from "./metadatadialog/PermittedSignersDialog";
import { RoyaltiesDialog } from "./metadatadialog/RoyaltiesDialog";

export const CollectionRow = ({
  item,
  permissions,
  selectedCollections,
  toggleSelectedCollection,
  setActiveCollection,
  activeCollection,
}: {
  activeCollection: IRpcObject<Collection> | undefined;
  setActiveCollection: Dispatch<SetStateAction<IRpcObject<Collection>>>;
  permissions: IRpcObject<CollectionPermissions> | undefined;
  item: IRpcObject<Collection>;
  selectedCollections: Set<PublicKey>;
  toggleSelectedCollection: (pubkey: PublicKey, b: boolean) => any;
}) => {
  const deletedKeys = useDeletedKeysStore((state) => state.deletedKeys);
  return (
    <Tr
      sx={{
        background: deletedKeys.has(item.pubkey) ? "#fee" : "none",
      }}
    >
      <Td
        borderLeft={`10px solid ${
          activeCollection?.pubkey?.equals(item.pubkey) ? "teal" : "none"
        }`}
      >
        <Center>
          <Checkbox
            isChecked={selectedCollections.has(item.pubkey)}
            onChange={(e) => {
              toggleSelectedCollection(item.pubkey, e.currentTarget.checked);
            }}
          />
        </Center>
      </Td>
      <Td>
        <Box>
          {item.item.collectionRenderMode.url && (
            <ImageUploader
              currentImage={item.item.collectionRenderMode.url.collectionUrl}
              linkedAccountId={item.pubkey.toBase58()}
              fileId={""}
              afterUpdate={() => {}}
            />
          )}
        </Box>
        {/* 
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <AttachmentIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="URL"
          value={collectionUrl}
          onChange={(e) => setCollectionUrl(e.currentTarget.value)}
        />
      </InputGroup> */}
      </Td>
      <Td>
        <Stack>
          <Center>
            <Box sx={{ display: "flex", flexDirection: "column" }} rowGap={5}>
              <Text fontSize="4xl">
                {item.item.name} [{item.item.symbol}]
              </Text>
              <CopyPublicKeyButton publicKey={item.pubkey.toBase58()} />

              <Button
                onClick={() => {
                  setActiveCollection(item);
                }}
              >
                View items ({item.item.itemCount.toString()})
              </Button>
            </Box>
          </Center>
        </Stack>
      </Td>

      <Td>
        <Center>
          <Box sx={{ display: "flex", flexDirection: "column" }} rowGap={5}>
            <Center>
              {(item.item.nftCollectionData?.royaltyBps / 100).toFixed(2)}%
            </Center>
            {item.item.nftCollectionData?.royaltyShares && (
              <RoyaltiesDialog
                royalties={item.item.nftCollectionData?.royaltyShares}
              />
            )}
          </Box>
        </Center>
      </Td>

      <Td isNumeric>
        <Center>
          {item.item.nftCollectionData?.royaltyShares && (
            <PermittedSignersDialog
              permittedSigners={item.item.nftCollectionData?.permittedSigners}
            />
          )}
        </Center>
      </Td>
      <Td isNumeric>
        <AttributesDialog
          attributeTypes={item.item.nftCollectionData?.attributeTypes ?? []}
        />
      </Td>
    </Tr>
  );
};
