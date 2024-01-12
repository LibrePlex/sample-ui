import {
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  HStack,
  Text,
  Button
} from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import { MarketplaceButtonBody } from "./MarketplaceButtonBody";
import React from "react";

export const TradeButton = ({ mint }: { mint: PublicKey }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <HStack>
        <Button
          aria-label={"trade"}
          background={"teal"}
          onClick={() => {
            setOpen(true);
          }}
        >
          Trade
        </Button>
      
      </HStack>

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
            <MarketplaceButtonBody mint={mint} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
