import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { EditGroupPanel } from "./EditGroupPanel";

export const EditGroupDialog = ({
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
          <EditGroupPanel onSuccess={()=>{}
            // ()=>alert('success')
            // onClose
            }/>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
