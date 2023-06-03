import { FC } from "react";
import { SignMessage } from "../../components/SignMessage";
import { SendTransaction } from "../../components/SendTransaction";
import { SendVersionedTransaction } from "../../components/SendVersionedTransaction";
import {
  Box,
  Center,
  Heading,
  Link,
  ListItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { StyledTabs } from "components/tabs/Tabs";
import { MintTaxInfoDialog } from "./MintTaxInfoDialog";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export const CostsView: FC = ({}) => {
  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1
          className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8"
          style={{ paddingBottom: "10px" }}
        >
          Cost Comparison
        </h1>
        <Heading textAlign={"center"} mb={7} size="2xl">
          Cost of 10k Mint
        </Heading>
        <Box
          display="flex"
          columnGap={"20px"}
          sx={{ mt: "10px", maxWidth: "600px" }}
        >
          <Table>
            <Thead>
              <Tr>
                <Th></Th>
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
                <Td>
                  Mint tax <MintTaxInfoDialog />
                </Td>{" "}
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
                <Td>Metadata</Td>
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
                <Td>Royalty Enforcement</Td>

                <Td>
                  <Center>
                    <Text sx={{ color: "lightgreen" }}>0.001 SOL</Text>
                  </Center>
                </Td>
                <Td>
                  <Center>
                    <Text sx={{ color: "#f44" }}>0.0043 SOL</Text>
                  </Center>
                </Td>
              </Tr>
              {/* <Tr>
                <Td>Royalty Enforcement</Td>

                <Td>
                  <Center>
                    <Text sx={{ color: "lightgreen" }}>0 SOL</Text>
                  </Center>
                </Td>
                <Td>
                  <Center>
                    <Text sx={{ color: "#f44" }}>0.00145 SOL</Text>
                  </Center>
                </Td>
              </Tr>
              <Tr>
                <Td>Master edition</Td>

                <Td>
                  <Center>
                    <Text sx={{ color: "lightgreen" }}>0 SOL</Text>
                  </Center>
                </Td>
                <Td>
                  <Center>
                    <Text sx={{ color: "#f44" }}>0.00285 SOL</Text>
                  </Center>
                </Td>
              </Tr> */}
              <Tr>
                <Td>Mint</Td>
                <Td colSpan={2}>
                  <Center>0.00146 SOL</Center>
                </Td>
              </Tr>
              <Tr>
                <Td>Token account</Td>
                <Td colSpan={2}>
                  <Center>0.00204 SOL</Center>
                </Td>
              </Tr>

              <Tr>
                <Td>Single mint total cost</Td>

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
                <Td>10k mints total cost</Td>

                <Td>
                  <Center>
                    <Text sx={{ color: "lightgreen", fontWeight: "800" }}>
                      61.9 SOL
                    </Text>
                  </Center>
                </Td>
                <Td>
                  <Center>
                    <Text sx={{ color: "#f44", fontWeight: "800" }}>
                      234.1 SOL
                    </Text>
                  </Center>
                </Td>
              </Tr>
              <Tr>
                <Td>Protocol fees</Td>

                <Td>
                  <Center>
                    <Text>
                      <Text sx={{ color: "lightgreen", fontWeight: "800" }}>
                        0 SOL
                      </Text>
                    </Text>
                  </Center>
                </Td>
                <Td>
                  <Center>
                    <Text sx={{ color: "#f44", fontWeight: "800" }}>
                      100.0 SOL
                    </Text>
                  </Center>
                </Td>
              </Tr>

            
              <Tr>
                <Td>License</Td>

                <Td>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignContent={"center"}
                    alignItems={"center"}
                  >
                    <Center>
                      <Text sx={{ color: "lightgreen", fontWeight: "800" }}>MIT</Text>
                    </Center>
                  </Box>
                </Td>
                <Td>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignContent={"center"}
                    alignItems={"center"}
                    sx={{ width: "100%" }}
                  >
                    <Center>
                      <Text sx={{ color: "#f44", fontWeight: "800" }}>
                        Proprietary
                      </Text>
                    </Center>
                  </Box>
                </Td>
              </Tr>
              <Tr>
                <Td>Total funding to date</Td>
                <Td>
                  <Center>0</Center>
                </Td>
                <Td>
                  <Center>47,000,000 USD</Center>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </div>
    </div>
  );
};
