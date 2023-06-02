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
import { Collection } from "query/collections";

export const EditMetadataDialog = ({
  open,
onClose,
  collection,
}: {
  collection: IRpcObject<Collection>;
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
