import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  Text,
} from "@chakra-ui/react";
import { RawAccount } from "@solana/spl-token";

import React, { useState } from "react";
import {
  Collection,
  GroupSelector,
  IRpcObject,
  Metadata,
  useInscriptionForRoot,
} from "@libreplex/shared-ui";
import { PublicKey } from "@solana/web3.js";
import { CreateNewLegacyInscriptionModalBody } from "./CreateNewLegacyInscriptionModalBody";

enum InscribeAs {
  Uauth,
  Holder,
}

export const CreateNewLegacyInscriptionModal = ({
  mint,
}: {
  mint: PublicKey;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const [selectedGroup, setSelectedGroup] =
    useState<IRpcObject<Collection | null>>();

  const [name, setName] = useState<string>("");

  const {inscription: { data: inscription }} = useInscriptionForRoot(mint);

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        {inscription?.item ? "View/edit" : "Create"} Inscription
      </Button>
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {inscription?.item ? "Edit" : "Create new"} legacy inscription
          </ModalHeader>

          <ModalCloseButton />
          <CreateNewLegacyInscriptionModalBody mint={mint} />
        </ModalContent>
      </Modal>
    </>
  );
};
