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
          Libreplex -v- Legacy
        </h1>

        <Box
          display="flex"
          columnGap={"20px"}
          sx={{ mt: "10px", maxWidth: "600px" }}
        >
          <Table>
            <Thead>
              <Tr>
                <Th></Th>
                <Th colSpan={2}>
                  <Center>Cost (SOL)</Center>
                </Th>
              </Tr>
              <Tr>
                <Th></Th>
                <Th>LibrePlex</Th>
                <Th>Metaplex</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>
                  Mint tax <MintTaxInfoDialog />
                </Td>{" "}
                <Td>
                  <Center>0</Center>
                </Td>
                <Td>
                  <Center>0.01</Center>
                </Td>
              </Tr>
              <Tr>
                <Td>Create mint</Td>
                <Td colSpan={2}>
                  <Center>0.0014616</Center>
                </Td>
              </Tr>
              <Tr>
                <Td>Create token account</Td>
                <Td colSpan={2}>
                  <Center>0.00203928</Center>
                </Td>
              </Tr>

              <Tr>
                <Td>Create metadata</Td>
                <Td>
                  <Center>0.00168432</Center>
                </Td>
                <Td>
                  <Center>0.00561672</Center>
                </Td>
              </Tr>
              <Tr>
                <Td>Create token record</Td>

                <Td>
                  <Center>0</Center>
                </Td>
                <Td>
                  <Center>0.00144768</Center>
                </Td>
              </Tr>
              <Tr>
                <Td>Create master edition</Td>

                <Td>
                  <Center>0</Center>
                </Td>
                <Td>
                  <Center>0.0028536</Center>
                </Td>
              </Tr>
              <Tr>
                <Td>Total cost per mint</Td>

                <Td>
                  <Center>0.00519</Center>
                </Td>
                <Td>
                  <Center>0.02342</Center>
                </Td>
              </Tr>
              <Tr>
                <Td>Cost per 10k collection</Td>

                <Td>
                  <Center>51.9 SOL</Center>
                </Td>
                <Td>
                  <Center>234.2 SOL</Center>
                </Td>
              </Tr>
              <Tr>
                <Td>Protocol fees per 10k collection</Td>

                <Td>
                  <Center>0 SOL</Center>
                </Td>
                <Td>
                  <Center>100.0 SOL</Center>
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
                    sx={{ width: "100%"}}
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
