import { FC } from "react";
import { SignMessage } from "../../components/SignMessage";
import { SendTransaction } from "../../components/SendTransaction";
import { SendVersionedTransaction } from "../../components/SendVersionedTransaction";
import {
  Box,
  ListItem,
  OrderedList,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  UnorderedList,
} from "@chakra-ui/react";
import { StyledTabs } from "components/tabs/Tabs";

export const MetadataBasics: FC = ({}) => {
  return (
    <Box>
      <h3 className="text-2xl">Unchanged</h3>
      <Box>
        <OrderedList
          sx={{
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <ListItem>Name</ListItem>
        </OrderedList>
      </Box>
      <h3 className="text-2xl">Changed</h3>
      <Box>
        <OrderedList
          sx={{
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <ListItem>Off-chain attributes made optional</ListItem>
          <ListItem>Authority moved to collection</ListItem>
          <ListItem>Symbol moved to collection</ListItem>
          <ListItem>Creators (verified status removed from royalty array)</ListItem>
          <ListItem>Royalties (handled independently from creators)</ListItem>
        </OrderedList>
      </Box>
      <h3 className="text-2xl">New concepts</h3>
      <Box>
        <OrderedList
          sx={{
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <ListItem>
            Creator verification (done independently from royalties)
          </ListItem>
          <ListItem>On-chain attributes</ListItem>
          <ListItem>URL to allow base64 and ordinals</ListItem>
        </OrderedList>
      </Box>
      <h3 className="text-2xl">Under discussion</h3>
      <Box>
        <OrderedList
          sx={{
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <ListItem>Delegation types</ListItem>
          <ListItem>
            Royalty enforcement mechanism (token-2022 -v- metadata)
          </ListItem>
        </OrderedList>
      </Box>
    </Box>
  );
};
