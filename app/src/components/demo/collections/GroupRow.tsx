import {
  Box,
  Button,
  Center,
  Checkbox,
  Stack,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import { CopyPublicKeyButton, Group, LibreplexMetadata, MetadataProgramContext } from "shared-ui";
import { IRpcObject } from "shared-ui";

import { PublicKey } from "@solana/web3.js";
import { ImageUploader } from "@/components/shadowdrive/ImageUploader";
import { Dispatch, SetStateAction, useContext } from "react";

import { AttributesDialog } from "./AttributesDialog";
import { PermittedSignersDialog } from "./metadatadialog/PermittedSignersDialog";
import { RoyaltiesDialog } from "./metadatadialog/RoyaltiesDialog";
import { IdlAccounts } from "@coral-xyz/anchor";
import { useStore } from "zustand";




export const GroupRow = ({
  item,
  selectedCollections,
  toggleSelectedCollection,
  setActiveCollection,
  activeCollection,
}: {
  activeCollection: IRpcObject<Group> | undefined;
  setActiveCollection: Dispatch<SetStateAction<IRpcObject<Group>>>;
  item: IRpcObject<Group>;
  selectedCollections: Set<PublicKey>;
  toggleSelectedCollection: (pubkey: PublicKey, b: boolean) => any;
}) => {

  const {store} = useContext(MetadataProgramContext)

  const deletedKeys = useStore(store, (state) => state.deletedKeys);
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
          {item.item?.url && (
            <ImageUploader
              currentImage={item.item?.url}
              linkedAccountId={item.pubkey?.toBase58()}
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
              <Text fontSize="4xl">{item.item?.name}</Text>
              <CopyPublicKeyButton publicKey={item.pubkey?.toBase58()} />

              <Button
                onClick={() => {
                  setActiveCollection(item);
                }}
              >
                View items ({item.item?.itemCount?.toString()})
              </Button>
            </Box>
          </Center>
        </Stack>
      </Td>

      <Td>
        <Center>
          <Box sx={{ display: "flex", flexDirection: "column" }} rowGap={5}>
            <Center>{(item.item.royalties?.bps / 100).toFixed(2)}%</Center>
            {item.item.royalties && (
              <RoyaltiesDialog royalties={item.item.royalties} />
            )}
          </Box>
        </Center>
      </Td>

      <Td isNumeric>
        <Center>
          {item.item.royalties?.shares && (
            <PermittedSignersDialog
              permittedSigners={item.item?.permittedSigners}
            />
          )}
        </Center>
      </Td>
      <Td isNumeric>
        <AttributesDialog attributeTypes={item.item.attributeTypes ?? []} />
      </Td>
    </Tr>
  );
};
