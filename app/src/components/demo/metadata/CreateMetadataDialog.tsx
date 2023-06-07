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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MutableInfoPanel } from "../collections/metadatadialog/MutableInfoDialog";
import { AttributeSelectorPanel } from "../collections/metadatadialog/AttributeSelectorPanel";
import { KeyGenerator } from "components/KeyGenerator";
import { Keypair, PublicKey } from "@solana/web3.js";
import { CreateMetadataTransactionButton } from "./CreateMetadataTransactionButton";
import { CopyPublicKeyButton } from "components/buttons/CopyPublicKeyButton";

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

  const [generatedMint, setGeneratedMint] = useState<Keypair>(
    Keypair.generate()
  );

  const [status, setStatus] = useState<Status>(Status.NotStarted);

  const [selectedMint, setSelectedMint] = useState<Keypair>();

  useEffect(() => {
    setStatus(Status.NotStarted);
  }, [generatedMint]);

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
                  An LibrePlex standard, each metadata item belongs to a
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
                  name,
                  mint: generatedMint,
                  symbol,
                  url,
                  description,
                }}
                formatting={{
                  isDisabled: status !== Status.NotStarted,
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
