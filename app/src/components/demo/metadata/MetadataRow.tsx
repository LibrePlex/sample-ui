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

import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { AttributesDisplay } from "components/metadata/AttributesDisplay";
import { SignersDisplay } from "components/metadata/SignersDisplay";
import { OrdinalUploader } from "components/onft/OrdinalUploader";
import { ImageUploader } from "components/shadowdrive/ImageUploader";
import { getMetadataExtendedPda } from "pdas/getMetadataExtendedPda";
import { useGroupById } from "query/group";
import { useInscriptionById } from "query/inscriptions";
import { Metadata } from "query/metadata";
import {
  useMetadataExtendedById
} from "query/metadataExtension";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import useDeletedKeysStore from "stores/useDeletedKeyStore";
import { RoyaltiesDialog } from "../collections/metadatadialog/RoyaltiesDialog";
import { ExtendMetadataDialog } from "./extend/ExtendMetadataDialog";
import { InscriptionCell } from "./ordinal/InscriptionCell";

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
  const deletedKeys = useDeletedKeysStore((state) => state.deletedKeys);

  const [open, setOpen] = useState<boolean>(false);

  const [attributesOpen, setAttributesOpen] = useState<boolean>(false);

  const [signersOpen, setSignersOpen] = useState<boolean>(false);

  const metadataExtendedId = useMemo(
    () => getMetadataExtendedPda(item.pubkey)[0],
    [item]
  );

  const { connection } = useConnection();

  const metadataExtended = useMetadataExtendedById(
    metadataExtendedId,
    connection
  );

  const instructionId = useMemo(
    () =>
      item.item.asset?.inscription
        ? item.item.asset?.inscription.accountId
        : null,
    [item.item]
  );

  const inscription = useInscriptionById(instructionId, connection);

  const group = useGroupById(metadataExtended?.item?.group ?? null, connection);

  // const inscriptionsPerId = useMemo(() => {
  //   const _inscriptions: { [key: string]: IRpcObject<Inscription> } = {};

  //   for (const d of inscriptionData.data) {
  //     _inscriptions[d.pubkey.toBase58()] = d;
  //   }
  //   return _inscriptions;
  // }, [inscriptionData]);

  // const inscriptionsPerMetadata = useMemo(() => {
  //   const _dict: { [key: string]: IRpcObject<Inscription> } = {};
  //   for (const d of inscriptionIds) {
  //     _dict[d.metadataId.toBase58()] = inscriptionsPerId[inscriptionIdsPerMetadata[d.metadataId.toBase58()].toBase58()];
  //   }
  //   return _dict;
  // }, [inscriptionIds, inscriptionIdsPerMetadata, inscriptionsPerId]);

  // useEffect(()=>{
  //   console.log({inscriptionsPerMetadata, inscriptionIdsPerMetadata, inscriptionsPerId, ids: inscriptionIds.map(item=>item.inscriptionId)})
  // },[inscriptionsPerMetadata, inscriptionIdsPerMetadata, inscriptionsPerId, inscriptionIds])

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
            <OrdinalUploader inscription={inscription} afterUpdate={() => {}} />
          ) : (
            <Text>Cannot upload this asset type</Text>
          )}
        </Box>
      </Td>
      <Td>
        <Text fontSize="2xl">{item.item.name}</Text>
      </Td>
      <Td>
        <Stack sx={{ width: "100%" }}>
          <Center>
            <Box sx={{ display: "flex", flexDirection: "column" }} rowGap={5}>
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
      <Td>
        {inscription ? (
          <InscriptionCell inscription={inscription} />
        ) : item.item.asset.image ? (
          "On-chain image"
        ) : (
          "Other"
        )}
      </Td>
      {metadataExtended && group ? (
        <>
          <Td>
            <CopyPublicKeyButton publicKey={group.pubkey.toBase58()} />
          </Td>

          <Td>
            <RoyaltiesDialog
              royalties={
                metadataExtended.item.royalties ?? group.item.royalties
              }
            />
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
        </Td>
      )}
    </Tr>
  );
};
