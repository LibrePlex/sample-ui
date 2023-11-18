import { FaEarlybirds } from "react-icons/fa6";
import { InfoIcon } from "@chakra-ui/icons";
<Text as="b">Dynamic Rendering</Text>;
import {
  Box,
  Button,
  Center,
  Flex,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  VStack,
  Text,
  UnorderedList,
  ListItem,
  IconButton,
  Portal,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { useInscriptionV3ById } from "shared-ui/src/sdk/query/inscriptions/inscriptionsV3";
import { useInscriptionV3ForRoot } from "shared-ui/src/sdk/query/inscriptions/useInscriptionV2ForRoot";
import { MigrateToV3TransactionButton } from "../../../v3migration/MigrateToV3TransactionButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { useInscriptionForRoot, useOffChainMetadataCache } from "shared-ui/src";
import { useState } from "react";
import { TensorButtonBody } from "./TensorButtonBody";

export const TensorButton = ({ mint }: { mint: PublicKey }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <IconButton
        aria-label={"tensorhq"}
        onClick={() => {
          setOpen(true)
        }}
      >
        <img src="/tensorhq.png" style={{ height: "28px" }} />
      </IconButton>

      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Inscription Trading</ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            <TensorButtonBody mint={mint} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
