import { ExternalLinkIcon, InfoIcon } from "@chakra-ui/icons";
import {
  Text,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Box,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";

export const MintTaxInfoDialog = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Button
        size="sm"
        onClick={() => {
          setOpen(true);
        }}
      >
        <InfoIcon />
      </Button>
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mint tax</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              display="flex"
              flexDir={"column"}
              alignItems="center"
              gap={2}
              pb={"10px"}
            >
              <Box>
                <Text>
                  Mint tax is a non-recoverable 0.01 SOL fee per mint that is paid to Metaplex
                  Studios. The fee is built into the metaplex metadata token
                  smart contract and payable for each metadata account that is
                  created using the program. The fee was first announced on 24
                  May 2023.
                </Text>
              </Box>

              <Box display="flex" flexDirection="column" alignItems="center" rowGap={3}>
                <Box>Metaplex info:</Box>
                <Box>
                  <Text sx={{ maxWidth: "250px" }} textAlign={'center'}>
                    Metaplex Studios, Inc. 2093 Philadelphia Pike #6382
                    Claymont, Delaware 19703
                  </Text>
                </Box>
                <Link
                  href="https://docs.metaplex.com/resources/protocol-fees"
                  isExternal
                >
                  Fees <ExternalLinkIcon mx="2px" />
                </Link>
                <Link
                  isExternal
                  href="https://www.crunchbase.com/organization/metaplex-studios"
                >
                  Crunchbase <ExternalLinkIcon mx="2px" />
                </Link>
                <Link
                  isExternal
                  href="https://www.metaplex.com/terms-disclaimer"
                >
                  Terms <ExternalLinkIcon mx="2px" />
                </Link>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
