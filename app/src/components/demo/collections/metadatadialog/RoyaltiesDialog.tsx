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

export const RoyaltiesDialog = ({
  royalties,
}: {
  royalties: Collection["nftCollectionData"]["royaltyShares"];
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      {royalties.length > 0 ? (
        <>
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            {royalties.length}
          </Button>
          <Modal
            isOpen={open}
            onClose={() => {
              setOpen(false);
            }}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Royalty shares</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box pb={2}>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Recipient</Th>
                        <Th isNumeric>Share (%)</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {royalties.map((item) => (
                        <Tr>
                          <Td>
                            <CopyPublicKeyButton publicKey={item.recipient.toBase58()} />
                          </Td>
                          <Td isNumeric>{Number(item.share/100).toFixed(2)}</Td>
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
