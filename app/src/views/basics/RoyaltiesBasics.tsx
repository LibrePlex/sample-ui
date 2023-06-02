import { FC } from "react";
import { SignMessage } from "../../components/SignMessage";
import { SendTransaction } from "../../components/SendTransaction";
import { SendVersionedTransaction } from "../../components/SendVersionedTransaction";
import {
  Box,
  List,
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

export const RoyaltiesBasics: FC = ({}) => {
  return (
    <Box sx={{maxWidth :"600px"}}>
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
      <h3 className="text-2xl">Changed</h3>
      <Box>
        <OrderedList>
          <ListItem>
            Royalty enforcement will continue. The exact mechanism is under
            discussion (whether token 2022 if possible or native to LibrePlex).
          </ListItem>
          <ListItem>
            Royalties will be specified independently of creator signatures.
          </ListItem>
          <ListItem>
            Royalties can be specified either at collection level or with
            individual overrides at mint level.
          </ListItem>
          <ListItem>
            Royalty share granularity will increase from percentage to basis
            points.
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
