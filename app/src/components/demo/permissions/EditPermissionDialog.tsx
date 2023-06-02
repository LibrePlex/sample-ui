import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { EditCollectionPanel } from "./EditPermissionPanel";

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
      <EditCollectionPanel onSuccess={onClose}/>
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
