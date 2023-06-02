import { FC } from "react";
import { SignMessage } from "../../components/SignMessage";
import { SendTransaction } from "../../components/SendTransaction";
import { SendVersionedTransaction } from "../../components/SendVersionedTransaction";
import {
  Box,
  ListItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  UnorderedList,
} from "@chakra-ui/react";
import { StyledTabs } from "components/tabs/Tabs";
import { MetadataBasics } from "./MetadataBasics";
import { CollectionBasics } from "./CollectionBasics";
import { RoyaltiesBasics } from "./RoyaltiesBasics";
import { CreatorVerificationBasics } from "./CreatorVerificationBasics";

export const BasicsView: FC = ({}) => {
  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8"
        style={{paddingBottom: "10px"}}>
          Key Design Concepts
        </h1>
        {/* CONTENT GOES HERE */}

        <Box display="flex" columnGap={"20px"} sx={{mt: '10px', maxWidth: "800px"}}>
          <Box display="flex" flexDirection={"column"}>
            <h5 className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-8">
              Objectives
            </h5>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pb: 3,
              }}
            >
              <UnorderedList
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "start",
                  alignItems: "start",
                }}
              >
                <ListItem>Retain existing functionality</ListItem>
                <ListItem>Ease of on-boarding</ListItem>
                <ListItem>Developer experience</ListItem>
                <ListItem>Migration tools</ListItem>
                <ListItem>Minimize rent</ListItem>
                <ListItem>Incorporate new use cases</ListItem>
                <ListItem>Future-proofing</ListItem>
              </UnorderedList>
            </Box>
          </Box>

          <StyledTabs>
            <TabList>
              <Tab>Metadata</Tab>
              <Tab>Collections</Tab>
              <Tab>Royalties</Tab>
              <Tab>Creator verification</Tab>
            </TabList>

            <TabPanels>
              <TabPanel
                pl={'30px'}
                sx={{
                
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                <MetadataBasics />
              </TabPanel>
              <TabPanel
                pl={'30px'}
                sx={{
                
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                <CollectionBasics />
              </TabPanel>
              <TabPanel
                pl={'30px'}
                sx={{
                
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                <RoyaltiesBasics />
              </TabPanel>
              <TabPanel
                pl={'30px'}
                sx={{
                
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                <CreatorVerificationBasics />
              </TabPanel>
            </TabPanels>
          </StyledTabs>
        </Box>
        {/* <SignMessage />
          <SendTransaction />
          <SendVersionedTransaction /> */}
      </div>
    </div>
  );
};
