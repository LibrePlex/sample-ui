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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  Flex,
  Center,
} from "@chakra-ui/react";
import React from "react";
import { useState } from "react";

export const MintTaxInfoDialog = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Popover size="md">
        <PopoverTrigger>
          <Button colorScheme="white" variant="outline">
            <InfoIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>
            <Flex justify="space-between" align="center" p={2}>
              <Box>
                <Text as="b">Mint tax</Text>
              </Box>
            </Flex>
          </PopoverHeader>
          <Box
            p={6}
            display="flex"
            flexDir={"column"}
            alignItems="center"
            gap={2}
            pb={"10px"}
          >
            <Box>
              <Text>
                Mint tax is a non-recoverable 0.01 SOL fee per mint that is paid
                to Metaplex Studios. The fee is built into the metaplex metadata
                token smart contract and payable for each metadata account that
                is created using the program. The fee was first announced on 24
                May 2023.
              </Text>
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              rowGap={3}
            >
              <Box>Metaplex info:</Box>
              <Box>
                <Text sx={{ maxWidth: "250px" }} textAlign={"center"}>
                  Metaplex Studios, Inc. 2093 Philadelphia Pike #6382 Claymont,
                  Delaware 19703
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
              <Link isExternal href="https://www.metaplex.com/terms-disclaimer">
                Terms <ExternalLinkIcon mx="2px" />
              </Link>
            </Box>
          </Box>
        </PopoverContent>
      </Popover>
    </>
  );
};
