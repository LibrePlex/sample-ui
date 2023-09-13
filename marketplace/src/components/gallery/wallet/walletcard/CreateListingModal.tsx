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
  import { Group, GroupSelector, IRpcObject, Metadata } from "@libreplex/shared-ui";
import { WalletAction } from "./WalletAction";
  
  export const CreateListingModal = ({item}:{item: IRpcObject<RawAccount>}) => {
    const [open, setOpen] = useState<boolean>(false);
  
    const [selectedGroup, setSelectedGroup] =
      useState<IRpcObject<Group | null>>();
  
    const [name, setName] = useState<string>("");
  
    return (
      <>
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          List
        </Button>
        <Modal
          isOpen={open}
          onClose={() => {
            setOpen(false);
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>List</ModalHeader>
           
            <ModalCloseButton />
            <ModalBody>
            <Box p={2}>
              <Text>
                LibrePlex Shopfront listings are organised in groups. Each group
                has a set of filters you can define to narrow down the items that
                can be listed in your shop.
              </Text>
            </Box>
             <WalletAction item={item}/>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  };
  