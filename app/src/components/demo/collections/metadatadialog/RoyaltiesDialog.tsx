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
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from "@chakra-ui/react";
import { CopyPublicKeyButton } from "shared-ui";
import { Group } from "shared-ui";
import { useState } from "react";

export const RoyaltiesDialog = ({
  royalties,
}: {
  royalties: Group["royalties"];
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      {royalties.shares.length > 0 ? (
        <>
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            Royalties: {(royalties?.bps / 100).toFixed(2)}% (
            {royalties.shares.length})
          </Button>
          <Modal
            isOpen={open}
            onClose={() => {
              setOpen(false);
            }}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Royalties</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>
                  Royalties are typically configured at collection level. For
                  fine-grain control, you may override collection-level settings
                  for each individual metadata item as well.
                </Text>
                <Box pb={2}>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th colSpan={2}>
                          Percentage: {(royalties?.bps / 100).toFixed(2)}%
                        </Th>
                      </Tr>
                    </Thead>
                    <Thead>
                      <Tr>
                        <Th>Recipient</Th>
                        <Th isNumeric>Share (%)</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {royalties.shares.map((item, idx) => (
                        <Tr key={idx}>
                          <Td>
                            <CopyPublicKeyButton
                              publicKey={item.recipient.toBase58()}
                            />
                          </Td>
                          <Td isNumeric>
                            {Number(item.share / 100).toFixed(2)}
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
