import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { EditPermissionPanel } from "./EditPermissionPanel";

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
      <EditPermissionPanel onSuccess={onClose}/>
      <ModalContent>
        <ModalHeader>Create Collection</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <EditPermissionPanel onSuccess={onClose}/>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
