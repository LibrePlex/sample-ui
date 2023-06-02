import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { EditCollectionPanel } from "./EditCollectionPanel";

export const EditCollectionDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => any;
}) => {
  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Collection</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <EditCollectionPanel onSuccess={onClose}/>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
