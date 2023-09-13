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
import { StyledTabs } from "@app/components/tabs/Tabs";

export const CreatorVerificationBasics: FC = ({}) => {
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
      <Heading fontSize="xl" style={{paddingTop: '15px'}}>Propose to change</Heading>
      <Box>
        Creator verification will be independent of royalties. Proposed flow is
        as follows:
        <OrderedList>
          <ListItem>
            Update authority establishes a list of permitted signers (can be
            done either at collection level or overridden at mint level)
          </ListItem>
          <ListItem>
            Signer signs the mint. The signatures are permanent and cannot be removed
            once signed, akin to a physical signature on a work of art.
          </ListItem>
        </OrderedList>

        Separating creator verification from royalties eliminates some odd workarounds like
        having creators with 0% royalty share taking up UI space and incurring unnecessary rent.
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
