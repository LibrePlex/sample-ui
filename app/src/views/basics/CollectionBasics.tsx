import { FC } from "react";
import { SignMessage } from "../../components/SignMessage";
import { SendTransaction } from "../../components/SendTransaction";
import { SendVersionedTransaction } from "../../components/SendVersionedTransaction";
import {
  Box,
  Heading,
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

export const CollectionBasics: FC = ({}) => {
  return (
    <Box>
      {/* <h3 className="text-2xl">Unchanged</h3>
      <Box>
        <UnorderedList
          sx={{
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <ListItem>Name</ListItem>
        </UnorderedList>
      </Box> */}
      <Heading fontSize="xl">Propose to change</Heading>
      <Box>
        <OrderedList
          sx={{
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <ListItem>Collection mints removed</ListItem>
          <ListItem>Collection account introduced</ListItem>
          <ListItem>
            Update authority held at collection level (w/ optional overrides at
            mint level)
          </ListItem>
          <ListItem>
            Royalties specified at collection level (w/ optional overrides at
            mint level)
          </ListItem>
          <ListItem>
            Royalty bps (formerly seller_fee_basis_points at collection level)
            (w/ optional overrides at mint level)
          </ListItem>
        </OrderedList>
      </Box>
      {/*      
      <h3 className="text-2xl">Under discussion</h3>
      <Box>
        <UnorderedList
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
        </UnorderedList>
      </Box> */}
    </Box>
  );
};
