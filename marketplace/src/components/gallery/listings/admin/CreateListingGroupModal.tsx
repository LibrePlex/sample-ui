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
import React, { useState } from "react";
import { CreateListingGroupTransactionButton } from "./CreateListingGroupTransactionButton";
import { Group, GroupSelector, IRpcObject } from "shared-ui";

export const CreateListingGroupModal = () => {
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
        Create new group
      </Button>
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create listing group</ModalHeader>
          <Box p={7}>
            <Text>
              LibrePlex Shopfront listings are organised in groups. Each group
              has a set of filters you can define to narrow down the items that
              can be listed in your shop.
            </Text>
          </Box>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Input
                placeholder="New listing group name"
                value={name}
                onChange={(e) => {
                  setName(e.currentTarget.value);
                }}
              />
              <GroupSelector
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
              />

              {selectedGroup?.pubkey && (
                <CreateListingGroupTransactionButton
                  formatting={{}}
                  params={{
                    name,
                    filterType: {
                      group: {
                        pubkey: selectedGroup?.pubkey,
                      },
                    },
                  }}
                />
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
