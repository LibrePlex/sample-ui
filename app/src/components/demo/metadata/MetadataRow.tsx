import {
  Box,
  Button,
  Center,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import { CopyPublicKeyButton } from "components/buttons/CopyPublicKeyButton";
import { IRpcObject } from "components/executor/IRpcObject";
import { Permissions } from "query/permissions";

import { PublicKey } from "@solana/web3.js";
import { Metadata } from "query/metadata";
import { MetadataExtended } from "query/metadataExtended";
import { Dispatch, SetStateAction, useState } from "react";
import useDeletedKeysStore from "stores/useDeletedKeyStore";
import { ExtendMetadataDialog } from "./extend/ExtendMetadataDialog";
import { MetadataExtendedPanel } from "./MetadataExtendedPanel";
import { AttributesDisplay } from "components/metadata/AttributesDisplay";
import { Group } from "query/group";
import { RoyaltiesDialog } from "../collections/metadatadialog/RoyaltiesDialog";
import { SignersDisplay } from "components/metadata/SignersDisplay";

export const MetadataRow = ({
  item,
  metadataExtended,
  group,
  permissions,
  selectedMetadataObjs,
  toggleSelectedMetadata,
  setActiveMetadata,
  activeMetadata,
}: {
  group: IRpcObject<Group>;
  activeMetadata: IRpcObject<Metadata> | undefined;
  setActiveMetadata: Dispatch<SetStateAction<IRpcObject<Metadata>>>;
  permissions: IRpcObject<Permissions> | undefined;
  item: IRpcObject<Metadata>;
  metadataExtended: IRpcObject<MetadataExtended>;
  selectedMetadataObjs: Set<PublicKey>;
  toggleSelectedMetadata: (pubkey: PublicKey, b: boolean) => any;
}) => {
  const deletedKeys = useDeletedKeysStore((state) => state.deletedKeys);

  const [open, setOpen] = useState<boolean>(false);

  const [attributesOpen, setAttributesOpen] = useState<boolean>(false);

  const [signersOpen, setSignersOpen] = useState<boolean>(false);

  return (
    <Tr
      sx={{
        background: deletedKeys.has(item.pubkey) ? "#fee" : "none",
      }}
    >
      <Td
        borderLeft={`10px solid ${
          activeMetadata?.pubkey?.equals(item.pubkey) ? "teal" : "none"
        }`}
      >
        <Center>
          <Checkbox
            isChecked={selectedMetadataObjs.has(item.pubkey)}
            onChange={(e) => {
              toggleSelectedMetadata(item.pubkey, e.currentTarget.checked);
            }}
          />
        </Center>
      </Td>
      <Td>
        <Box></Box>
      </Td>
      <Td>
        <Stack sx={{ width: "100%" }}>
          <Center>
            <Box sx={{ display: "flex", flexDirection: "column" }} rowGap={5}>
              <Text fontSize="4xl">{item.item.name}</Text>
              <Box display="flex" w={"100%"} justifyContent={"space-between"}>
                Metadata:{" "}
                <CopyPublicKeyButton publicKey={item.pubkey.toBase58()} />
              </Box>
              <Box display="flex" w={"100%"} justifyContent={"space-between"}>
                Mint:{" "}
                {item.item.mint && (
                  <CopyPublicKeyButton publicKey={item.item.mint.toBase58()} />
                )}
              </Box>

              <Button
                onClick={() => {
                  setActiveMetadata(item);
                }}
              >
                View item
              </Button>
            </Box>
          </Center>
        </Stack>
      </Td>
      {metadataExtended && group ? (
        <>
          <Td>
            <CopyPublicKeyButton publicKey={group.pubkey.toBase58()} />
          </Td>
          <Td>
            <RoyaltiesDialog royalties={metadataExtended.item.royalties ?? group.item.royalties} />
          </Td>
          <Td>
            <Button
              onClick={() => {
                setSignersOpen(true);
              }}
            >
              Signers: {metadataExtended.item.signers.length}
            </Button>
            <Modal
              isOpen={signersOpen}
              onClose={() => {
                setSignersOpen(false);
              }}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Signers</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text>
                    The signers that have signed this particular metadata item.
                    Permitted signers are configured at collection level.
                  </Text>
                  <SignersDisplay
                    signers={metadataExtended.item.signers}
                    group={group}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          </Td>
          <Td>
            <Button
              onClick={() => {
                setAttributesOpen(true);
              }}
            >
              {metadataExtended.item.attributes.length}
            </Button>
            <Modal
              isOpen={attributesOpen}
              onClose={() => {
                setAttributesOpen(false);
              }}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Attributes</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <AttributesDisplay
                    attributes={metadataExtended.item.attributes}
                    group={group}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          </Td>
        </>
      ) : (
        <Td colSpan={4}>
          <Center>
            <Button
              onClick={() => {
                setOpen(true);
              }}
            >
              Extend metadata
            </Button>
          </Center>
          <ExtendMetadataDialog
            metadata={item}
            open={open}
            onClose={() => {
              setOpen(false);
            }}
          />
          {/* <MetadataExtendedPanel metadataExtended={metadataExtended} metadata={item}/> */}
        </Td>
      )}
    </Tr>
  );
};
