import {
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text
} from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import { TensorButtonBody } from "./TensorButtonBody";
import React from "react";

export const TensorButton = ({ mint }: { mint: PublicKey }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <IconButton
        aria-label={"tensorhq"}
        background={'black'}
        onClick={() => {
          setOpen(true);
        }}
      >
        <img src="/tensorhq-white.png" style={{ height: "28px" }} />
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
