import {
  Box,
  Button,
  Center,
  Checkbox,
  Heading,
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
import { AssetDisplay, CopyPublicKeyButton, LibreplexMetadata } from "shared-ui";
import { IRpcObject } from "shared-ui";

import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { AttributesDisplay } from "@/components/metadata/AttributesDisplay";
import { SignersDisplay } from "@/components/metadata/SignersDisplay";
import { InscriptionUploader } from "@/components/onft/InscriptionUploader";
import { ImageUploader } from "@/components/shadowdrive/ImageUploader";
import { getMetadataExtendedPda } from "shared-ui";
import { useGroupById } from "shared-ui";
import { useInscriptionById } from "shared-ui";
import { Metadata } from "shared-ui";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import {useDeletedKeyStore} from "shared-ui";
import { RoyaltiesDialog } from "../collections/metadatadialog/RoyaltiesDialog";
import { InscriptionCell } from "./ordinal/InscriptionCell";
import { IdlAccounts } from "@coral-xyz/anchor";
import { ScannerLink } from "shared-ui";

export type Group = IdlAccounts<LibreplexMetadata>["group"];

export const MetadataRow = ({
  item,
  selectedMetadataObjs,
  toggleSelectedMetadata,
  setActiveMetadata,
  activeMetadata,
}: {
  activeMetadata: IRpcObject<Metadata> | undefined;
  setActiveMetadata: Dispatch<SetStateAction<IRpcObject<Metadata>>>;
  item: IRpcObject<Metadata>;
  selectedMetadataObjs: Set<PublicKey>;
  toggleSelectedMetadata: (pubkey: PublicKey, b: boolean) => any;
}) => {
  const deletedKeys = useDeletedKeyStore((state) => state.deletedKeys);

  const [open, setOpen] = useState<boolean>(false);

  const [attributesOpen, setAttributesOpen] = useState<boolean>(false);

  const [signersOpen, setSignersOpen] = useState<boolean>(false);

  
  const { connection } = useConnection();

  
  const inscriptionId = useMemo(
    () =>
      item.item.asset?.inscription
        ? item.item.asset?.inscription.accountId
        : null,
    [item.item]
  );

  const inscription = useInscriptionById(inscriptionId, connection);

  const group = useGroupById(item?.item?.group ?? null, connection);

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
        <Box>
          {item.item.asset?.image ? (
            <ImageUploader
              currentImage={item.item.asset?.image.url}
              linkedAccountId={item.item.mint.toBase58()}
              fileId={""}
              afterUpdate={() => {}}
            />
          ) : item.item.asset?.inscription ? (
            <InscriptionUploader
              inscription={inscription}
              afterUpdate={() => {}}
            />
          ) : item.item.asset.json ? 
          <AssetDisplay asset={item.item.asset}/>: (
            <Text>Cannot upload this asset type</Text>
          )}
        </Box>
      </Td>

      <Td>
        <Stack sx={{ width: "100%" }}>
          <Center>
            <Box sx={{ display: "flex", flexDirection: "column" }} rowGap={5}>
              <Text fontSize="2xl">{item.item.name}</Text>
              <Box display="flex" w={"100%"} justifyContent={"space-between"}>
                
                <CopyPublicKeyButton publicKey={item.pubkey.toBase58()} /> (metadata)
              </Box>
              <Box display="flex" w={"100%"} justifyContent={"space-between"}>
                {item.item.mint && (
                  <ScannerLink mintId={item.item.mint} /> 
                )}
                (mint)
              </Box>
              
              {inscription ? (
                <InscriptionCell inscription={inscription} />
              ) : item.item.asset.image ? (
                "On-chain metadata"
              ) : item.item.asset.json ? (
                "Off-chain metadata"
              ) : "Other"}

              {/* 
              <Button
                onClick={() => {
                  setActiveMetadata(item);
                }}
              >
                View item
              </Button> */}
            </Box>
          </Center>
        </Stack>
      </Td>

      {group ? (
        <>
          <Td>
            <CopyPublicKeyButton publicKey={group.pubkey.toBase58()} />
          </Td>

          <Td>
            <RoyaltiesDialog
              royalties={
                item.item.extension?.nft?.royalties ?? group.item.royalties
              }
            />
          </Td>
          <Td>
            <Button
              onClick={() => {
                setSignersOpen(true);
              }}
            >
              Signers: {item.item.extension?.nft?.signers?.length??0}
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
                    signers={item.item.extension?.nft?.signers??[]}
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
              {item.item.extension?.nft?.attributes.length??0}
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
                  <Heading>{item.item.extension?'y':'n'}</Heading>
                  <AttributesDisplay
                    attributes={[...(item.item.extension?.nft?.attributes??[])]}
                    group={group}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          </Td>
        </>
      ) : (
        <Td colSpan={4}>
              No group assigned
        </Td>
      )}
    </Tr>
  );
};
