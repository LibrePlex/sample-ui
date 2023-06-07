import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { EditMetadataPanel } from "./EditMetadataPanel";
import { IRpcObject } from "components/executor/IRpcObject";
import { Group } from "query/group";

export const EditMetadataDialog = ({
  open,
onClose,
  collection,
}: {
  collection: IRpcObject<Group>;
  open: boolean;
  onClose: () => any;
}) => {
  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Add Metadata to Collection ({collection.item.name})
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody sx={{ mb: "20px" }}>
          <EditMetadataPanel collection={collection} onSuccess={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
