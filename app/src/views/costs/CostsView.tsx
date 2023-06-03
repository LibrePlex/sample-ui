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
                <Td>Create metadata</Td>
                <Td>
                  <Center>
                    <Text sx={{ color: "lightgreen" }}>0.00168</Text>
                  </Center>
                </Td>
                <Td>
                  <Center>
                    <Text sx={{ color: "#f44" }}>0.00561</Text>
                  </Center>
                </Td>
              </Tr>
              <Tr>
                <Td>Create token record</Td>

                <Td>
                  <Center>
                    <Text sx={{ color: "lightgreen" }}>0</Text>
                  </Center>
                </Td>
                <Td>
                  <Center>
                    <Text sx={{ color: "#f44" }}>0.00145</Text>
                  </Center>
                </Td>
              </Tr>
              <Tr>
                <Td>Create master edition</Td>

                <Td>
                  <Center>
                    <Text sx={{ color: "lightgreen" }}>0</Text>
                  </Center>
                </Td>
                <Td>
                  <Center>
                    <Text sx={{ color: "#f44" }}>0.00285</Text>
                  </Center>
                </Td>
              </Tr>
              <Tr>
                <Td>Create mint</Td>
                <Td colSpan={2}>
                  <Center>0.00146</Center>
                </Td>
              </Tr>
              <Tr>
                <Td>Create token account</Td>
                <Td colSpan={2}>
                  <Center>0.00204</Center>
                </Td>
              </Tr>

              <Tr>
                <Td>Total cost per mint</Td>

                <Td>
                  <Center>
                    <Text sx={{ color: "lightgreen" }}>0.00519</Text>
                  </Center>
                </Td>
                <Td>
                  <Center>
                    <Text sx={{ color: "#f44" }}>0.02342</Text>
                  </Center>
                </Td>
              </Tr>
              <Tr>
                <Td>Cost per 10k collection</Td>

                <Td>
                  <Center>
                    <Text sx={{ color: "lightgreen", fontWeight: "800" }}>
                      51.9 SOL
                    </Text>
                  </Center>
                </Td>
                <Td>
                  <Center>
                    <Text sx={{ color: "#f44", fontWeight: "800" }}>
                      234.2 SOL
                    </Text>
                  </Center>
                </Td>
              </Tr>
              <Tr>
                <Td>Protocol fees per 10k collection</Td>

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
                <Td>Total funding to date (USD)</Td>
                <Td>
                  <Center>0</Center>
                </Td>
                <Td>
                  <Center>47,000,000</Center>
                </Td>
              </Tr>
              <Tr>
                <Td>Entity type</Td>

                <Td>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignContent={"center"}
                    alignItems={"center"}
                  >
                    <Center>Trust / Foundation</Center>
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
                    <Center>Private</Center>
                  </Box>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </div>
    </div>
  );
};
