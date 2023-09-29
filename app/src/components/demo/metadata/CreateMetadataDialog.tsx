import { CalendarIcon, InfoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from "react";
import { MutableInfoPanel } from "../collections/metadatadialog/MutableInfoDialog";
import { AttributeSelectorPanel } from "../collections/metadatadialog/AttributeSelectorPanel";
import { KeyGenerator } from "@app/components/KeyGenerator";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  AssetType,
  CreateMetadataTransactionButton,
} from "./createbuttons/CreateMetadataBaseTransactionButton";
import { CopyPublicKeyButton,IRpcObject, MetadataProgramContext } from  "@libreplex/shared-ui";
import { GroupSelector } from  "@libreplex/shared-ui";
import React from "react";
import { IdlAccounts } from "@coral-xyz/anchor";
import { LibreplexMetadata } from "@libreplex/idls/lib/types/libreplex_metadata";

export type Collection = IdlAccounts<LibreplexMetadata>["collection"];

enum View {
  Standalone,
  MintToCollection,
}

enum Status {
  NotStarted,
  Processing,
  Success,
}

export const CreateMetadataDialog = ({
  open,
  onClose,
}: {
  open;
  onClose: () => any;
}) => {
  const [name, setName] = useState<string>("");

  const [symbol, setSymbol] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [isMutable, setIsMutable] = useState<boolean>(false);

  const [selectedCollection, setSelectedCollection] = useState<IRpcObject<Collection|null>>(null);


  const numberOfAttributes = useMemo(
    () => selectedCollection?.item?.attributeTypes?.length ?? 0,
    [selectedCollection]
  );

  const [attributes, setAttributes] = useState<number[]>([
    ...Array(numberOfAttributes),
  ]);

  useEffect(() => {
    setAttributes([...Array(numberOfAttributes)]);
  }, [numberOfAttributes]);



  const [generatedMint, setGeneratedMint] = useState<Keypair>(
    Keypair.generate()
  );

  const [status, setStatus] = useState<Status>(Status.NotStarted);

  const [selectedMint, setSelectedMint] = useState<Keypair>();

  const [assetType, setAssetType] = useState<AssetType>(AssetType.Image);

  useEffect(() => {
    setStatus(Status.NotStarted);
  }, [generatedMint]);

  const {program} = useContext(MetadataProgramContext)

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Metadata</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button
                onClick={() => {
                  setShowInfo((old) => !old);
                }}
              >
                <InfoIcon />
              </Button>
              <Collapse in={showInfo}>
                <Text sx={{ maxWidth: "500px" }}>
                  In LibrePlex standard, each metadata item belongs to a
                  collection, including SPL tokens. You can create metadata in
                  the selected collection here.
                </Text>
              </Collapse>
            </Box>

            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <CalendarIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Metadata name"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Text color="gray.300">S</Text>
              </InputLeftElement>
              <Input
                placeholder="Symbol name"
                value={symbol}
                onChange={(e) => setSymbol(e.currentTarget.value)}
              />
            </InputGroup>

            <Textarea
              value={description}
              onChange={(e) => {
                setDescription(e.currentTarget.value);
              }}
              placeholder="Description"
              size="sm"
            />
            <Box display="flex" flexDirection={"column"} alignItems={"center"}>
              <Box p={3}>
                <Heading>Select asset type</Heading>
                <Text>
                  Select the asset type for this metadata. Currently all asset
                  types are owned by the metadata program, EXCEPT inscription asset
                  type that is owned by libreplex_inscriptions program. Both programs
                  allow assets to be immutable.
                </Text>
              </Box>

              <Box display="flex" columnGap={2}>
                <Button
                  variant={assetType === AssetType.Image ? "solid" : "outline"}
                  colorScheme={"teal"}
                  onClick={() => {
                    setAssetType(AssetType.Image);
                  }}
                >
                  Image (off-chain)
                </Button>
                <Button
                  variant={
                    assetType === AssetType.Inscription ? "solid" : "outline"
                  }
                  colorScheme={"teal"}
                  onClick={() => {
                    setAssetType(AssetType.Inscription);
                  }}
                >
                  Inscription
                </Button>
              </Box>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              flexDirection="row"
              sx={{ justifyContent: "space-between" }}
              columnGap={2}
            >
              <Checkbox
                checked={isMutable}
                onChange={(e) => {
                  setIsMutable(e.currentTarget.checked);
                }}
                colorScheme="red"
              >
                Mutable
              </Checkbox>
              <MutableInfoPanel />
            </Box>
            <GroupSelector
              selectedGroup={selectedCollection}
              setSelectedGroup={setSelectedCollection}
            />
             <AttributeSelectorPanel
              attributes={attributes}
              setAttributes={setAttributes}
              collection={selectedCollection}
            />

            <KeyGenerator
              generatedMint={generatedMint}
              setGeneratedMint={setGeneratedMint}
            />

            {status !== Status.Success && (
              <CreateMetadataTransactionButton
                beforeClick={() => {
                  setStatus(Status.Processing);
                }}
                onSuccess={() => {
                  setStatus(Status.Success);
                  setSelectedMint(generatedMint);
                }}
                params={{
                  metadataProgramId: program.programId,
                  name,
                  mint: generatedMint,
                  symbol,
                  assetType,
                  description,
                  collection: selectedCollection?.pubkey ?? null,
                  extension: {
                      attributes
                }}}
                formatting={{
                  // isDisabled: status !== Status.NotStarted,
                }}
              />
            )}

            {status === Status.Success && selectedMint && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text>Metadata added to mint:</Text>
                <Box p={1}>
                  <CopyPublicKeyButton
                    publicKey={selectedMint.publicKey.toBase58()}
                  />
                </Box>
                <Text>Please generate a new key to create another.</Text>
              </Box>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
