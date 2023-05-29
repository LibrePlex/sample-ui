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
import { CopyPublicKeyButton } from "components/buttons/CopyPublicKeyButton";
import { Collection } from "query/collections";
import { useState } from "react";

export const PermittedSignersDialog = ({
  permittedSigners,
}: {
  permittedSigners: Collection["nftCollectionData"]["permittedSigners"];
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
                      {permittedSigners.map((item) => (
                        <Tr>
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
