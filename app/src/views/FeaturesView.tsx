import { CheckCircleIcon, InfoIcon, NotAllowedIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { MintTaxInfoDialog } from "./costs/MintTaxInfoDialog";
import React from "react";

export const FeaturesView = () => {
  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1
          className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8"
          style={{ paddingBottom: "10px" }}
        >
          Feature comparison
        </h1>

        <Box
          display="flex"
          columnGap={"20px"}
          sx={{ mt: "10px", maxWidth: "800px" }}
          flexDirection="column"
        >
          <Box display="flex" flexDirection={"column"}>
            <Box
              sx={{
                mt: 0,
                pt: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pb: 5,
              }}
            >
              <Table>
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Td></Td>
                    <Th>
                      <img
                        src="LibrePlexLongLogo.png"
                        height={"35px"}
                        style={{ maxHeight: "35px" }}
                      />
                    </Th>
                    <Th>
                      <img
                        src="metaplexlogo.svg"
                        height={"35px"}
                        style={{ maxHeight: "35px" }}
                      />
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Th color="white">Dynamic Rendering</Th>
                    <Td>
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
                                <Text as="b">Dynamic Rendering</Text>
                              </Box>
                            </Flex>
                          </PopoverHeader>
                          <Box p={5}>
                            <Center>
                              <VStack align={"start"}>
                                <Box>
                                  <Text>
                                    A custom, on-chain, dynamic rendering
                                    program gives you full control over your
                                    digital asset rendering (image + attributes
                                    + description). Examples: . Examples:
                                  </Text>
                                </Box>
                                <UnorderedList>
                                  <ListItem>Day/night cycle</ListItem>
                                  <ListItem>Seasonality</ListItem>
                                  <ListItem>
                                    Native trait-swap: Custom rendering
                                    depending on attributes etc
                                  </ListItem>
                                </UnorderedList>
                              </VStack>
                            </Center>
                          </Box>
                        </PopoverContent>
                      </Popover>
                    </Td>
                    <Td>
                      <Center columnGap={2}>
                        <CheckCircleIcon color="lightgreen" />
                      </Center>
                    </Td>
                    <Td>
                      <Center>
                        <NotAllowedIcon color="#f44" />
                      </Center>
                    </Td>
                  </Tr>
                  <Tr>
                    <Th color="white">On-chain Images / Media</Th>
                    <Td>
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
                                <Text as="b">
                                  On-chain Media via Inscriptions
                                </Text>
                              </Box>
                            </Flex>
                          </PopoverHeader>
                          <Box p={5}>
                            <Center>
                              <Text>
                                Inscription data is stored directly on-chain, so
                                there are no dependencies on web2 services such
                                as arweave, S3 or shadowdrive. Your assets live
                                as long as solana lives.
                              </Text>
                            </Center>
                          </Box>
                        </PopoverContent>
                      </Popover>
                    </Td>
                    <Td>
                      <Center columnGap={2}>
                        <CheckCircleIcon color="lightgreen" />
                      </Center>
                    </Td>

                    <Td>
                      <Center>
                        <NotAllowedIcon color="#f44" />
                      </Center>
                    </Td>
                  </Tr>

                  <Tr>
                    <Th color="white">On-chain attributes</Th>
                    <Td>
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
                                <Text as="b">On-chain Attributes</Text>
                              </Box>
                            </Flex>
                          </PopoverHeader>
                          <Box p={5}>
                            <Center>
                              <Text>
                                On-chain attributes are useful when building
                                custom on-chain logic that depends on
                                attributes, such as attribute based stake
                                boosting or gating based on rarities. The key
                                advantage is you no longer have to fetch
                                attribute data off-chain and all data processing
                                can now happen natively on Solana.
                              </Text>
                            </Center>
                          </Box>
                        </PopoverContent>
                      </Popover>
                    </Td>
                    <Td>
                      <Center columnGap={2}>
                        <CheckCircleIcon color="lightgreen" />
                      </Center>
                    </Td>
                    <Td>
                      <Center>
                        <NotAllowedIcon color="#f44" />
                      </Center>
                    </Td>
                  </Tr>
                  <Tr>
                    <Th color="white">Off-chain Images / Media</Th>
                    <Td></Td>
                    <Td>
                      <Center>
                        <CheckCircleIcon color="lightgreen" />
                      </Center>
                    </Td>
                    <Td>
                      <Center>
                        <CheckCircleIcon color="lightgreen" />
                      </Center>
                    </Td>
                  </Tr>
                  <Tr>
                    <Th color="white">Off-chain attributes</Th>
                    <Td></Td>
                    <Td>
                      <Center>
                        <CheckCircleIcon color="lightgreen" />
                      </Center>
                    </Td>
                    <Td>
                      <Center>
                        <CheckCircleIcon color="lightgreen" />
                      </Center>
                    </Td>
                  </Tr>

                  <Tr>
                    <Th color="white">On-chain Images / Media</Th>
                    <Td>
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
                                <Text as="b">
                                  On-chain Media via Inscriptions
                                </Text>
                              </Box>
                            </Flex>
                          </PopoverHeader>
                          <Box p={5}>
                            <Center>
                              <Text>
                                Inscription data is stored directly on-chain, so
                                there are no dependencies on web2 services such
                                as arweave, S3 or shadowdrive. Your assets live
                                as long as solana lives.
                              </Text>
                            </Center>
                          </Box>
                        </PopoverContent>
                      </Popover>
                    </Td>
                    <Td>
                      <Center columnGap={2}>
                        <CheckCircleIcon color="lightgreen" />
                      </Center>
                    </Td>

                    <Td>
                      <Center>
                        <NotAllowedIcon color="#f44" />
                      </Center>
                    </Td>
                  </Tr>

                  <Tr>
                    <Th color="white">Asset Licensing</Th>
                    <Td>
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
                                <Text as="b">Asset Licensing</Text>
                              </Box>
                            </Flex>
                          </PopoverHeader>
                          <Box p={5}>
                            <Center>
                              <Text>
                                <Box
                                  rowGap={2}
                                  display={"flex"}
                                  flexDir={"column"}
                                >
                                  <Text maxW={"500px"}>
                                    Licensing built into the asset contracts.
                                    Examples:
                                  </Text>
                                  <UnorderedList>
                                    <ListItem>
                                      The holder of this token is entitled to
                                      warranty protection on a Breville toaster
                                      (serial number XXX-1234567890) until 31
                                      December 2027
                                    </ListItem>
                                    <ListItem>
                                      The holder of this NFT is allowed to print
                                      37 copies of psychotic terror monkey #8767
                                      NFT on a t-shirt of their choice and sell
                                      them. 10% of any generated profits must be
                                      donated to Gorilla Conservation at World
                                      Wildlife Fund.
                                    </ListItem>
                                  </UnorderedList>
                                </Box>
                              </Text>
                            </Center>
                          </Box>
                        </PopoverContent>
                      </Popover>
                    </Td>
                    <Td>
                      <Center>
                        <CheckCircleIcon color="lightgreen" />
                      </Center>
                    </Td>
                    <Td>
                      <Center>
                        <NotAllowedIcon color="#f44" />
                      </Center>
                    </Td>
                  </Tr>
                  <Tr>
                    <Th color="white">Royalty enforcement</Th>
                    <Td></Td>
                    <Td>
                      <Center columnGap={2}>
                        <CheckCircleIcon color="lightgreen" />
                      </Center>
                    </Td>
                    <Td>
                      <Center columnGap={2}>
                        <CheckCircleIcon color="lightgreen" />
                      </Center>
                    </Td>
                  </Tr>
                  <Tr>
                    <Th color="white">Creator signing / validation</Th>
                    <Td></Td>
                    <Td>
                      <Center columnGap={2}>
                        <CheckCircleIcon color="lightgreen" />
                      </Center>
                    </Td>
                    <Td>
                      <Center columnGap={2}>
                        <CheckCircleIcon color="lightgreen" />
                      </Center>
                    </Td>
                  </Tr>
                  <Tr>
                    <Th color="white" columnGap={2}>
                      Mint tax
                    </Th>
                    <Td>
                      <MintTaxInfoDialog />
                    </Td>
                    <Td>
                      <Center>
                        <Text sx={{ color: "lightgreen", fontWeight: "800" }}>
                          0 SOL
                        </Text>
                      </Center>
                    </Td>
                    <Td>
                      <Center>
                        <Text sx={{ color: "red", fontWeight: "800" }}>
                          0.01 SOL
                        </Text>
                      </Center>
                    </Td>
                  </Tr>

                  <Tr>
                    <Th color="white">Metadata rent</Th>
                    <Td></Td>
                    <Td>
                      <Center>
                        <Text sx={{ color: "lightgreen" }}>0.00168 SOL</Text>
                      </Center>
                    </Td>
                    <Td>
                      <Center>
                        <Text sx={{ color: "#f44" }}>0.00561 SOL</Text>
                      </Center>
                    </Td>
                  </Tr>

                  <Tr>
                    <Th color="white">Single mint create cost</Th>
                    <Td></Td>
                    <Td>
                      <Center>
                        <Text sx={{ color: "lightgreen" }}>0.00619 SOL</Text>
                      </Center>
                    </Td>
                    <Td>
                      <Center>
                        <Text sx={{ color: "#f44" }}>0.02341 SOL</Text>
                      </Center>
                    </Td>
                  </Tr>

                  <Tr>
                    <Th color="white">Codebase License</Th>
                    <Td></Td>
                    <Td>
                      <Center>
                        <Text sx={{ color: "lightgreen", fontWeight: "800" }}>
                          MIT
                        </Text>
                      </Center>
                    </Td>
                    <Td>
                      <Center>
                        <Text sx={{ color: "#f44", fontWeight: "800" }}>
                          Proprietary
                        </Text>
                      </Center>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};
<Box rowGap={2} display={"flex"} flexDir={"column"}>
  <Heading size={"lg"}>Native Licensing</Heading>
  <Text maxW={"500px"}>Licensing built into the asset contracts.</Text>
  <Text maxW={"500px"}>
    {
      '"The holder of this NFT is allowed to print 37 copies of the NFT on a t-shirt of their choice."'
    }
  </Text>
</Box>;
