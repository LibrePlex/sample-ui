import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Collection } from "query/collections";
import { useState } from "react";

export const AttributesDialog = ({
  attributeTypes,
}: {
  attributeTypes: Collection["nftCollectionData"]["attributeTypes"];
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      {attributeTypes.length > 0 ? (
        <>
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            {attributeTypes.length}
          </Button>
          <Modal
            isOpen={open}
            onClose={() => {
              setOpen(false);
            }}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Attribute types</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box pb={2}>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Attribute</Th>
                        <Th>Permitted values</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {attributeTypes.map((item, idx) => (
                        <Tr key={idx}>
                          <Td>{item.name}</Td>
                          <Td>
                            <Box display="flex" gap={1}>
                              {item.permittedValues.map((item, idx) => (
                                <Tag key={idx}>{item}</Tag>
                              ))}
                            </Box>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <>-</>
      )}
    </>
  );
};
