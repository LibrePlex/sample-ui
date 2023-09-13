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
} from "@chakra-ui/react";
import { CopyPublicKeyButton } from  "@libreplex/shared-ui";
import { Group } from  "@libreplex/shared-ui";
import { useState } from "react";

export const PermittedSignersDialog = ({
  permittedSigners,
}: {
  permittedSigners: Group["permittedSigners"];
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      {permittedSigners.length > 0 ? (
        <>
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            {permittedSigners.length}
          </Button>
          <Modal
            isOpen={open}
            onClose={() => {
              setOpen(false);
            }}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Permitted signers</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box pb={2}>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Signer</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {permittedSigners.map((item, idx) => (
                        <Tr key={idx}>
                          <Td>
                            <CopyPublicKeyButton publicKey={item.toBase58()} />
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
