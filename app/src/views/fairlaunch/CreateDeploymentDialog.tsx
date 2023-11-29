import {
  Box,
  Button,
  Checkbox,
  Heading,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  UnorderedList,
} from "@chakra-ui/react";
import { useState } from "react";
import { Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { CreateDeploymentDialogBody } from "./InitialiseDeploymentDialogBody";

export const CreateDeploymentDialog = () => {
  const [open, setOpen] = useState<boolean>();
  const onClose = () => {
    setOpen(false);
  };
  const [confirmed, setConfirmed] = useState<boolean>(false);

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        colorScheme={"teal"}
      >
        Create
      </Button>
      <Modal isOpen={open} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create LibrePlex Fair Launch</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box className="border" p={3}>
              <Text>
                LibrePlex Fair Launches have the following features
              </Text>
            
              <Box mt={3}>
                <Text>Summary</Text>
                <UnorderedList>
                  <ListItem>
                    <Text>
                      Auto-validation of generated tokens at creation.
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Text>
                      No need for external validation.
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Text>
                      Hashlists generated automatically and stored on-chain for marketplace integration.
                    </Text>
                  </ListItem>
                </UnorderedList>
              </Box>
            </Box>
            <CreateDeploymentDialogBody />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
