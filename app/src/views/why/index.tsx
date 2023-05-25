import { FC } from "react";
import { SignMessage } from "../../components/SignMessage";
import { SendTransaction } from "../../components/SendTransaction";
import { SendVersionedTransaction } from "../../components/SendVersionedTransaction";
import {
  Box,
  Heading,
  ListItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  UnorderedList,
} from "@chakra-ui/react";
import { StyledTabs } from "components/tabs/Tabs";

export const WhyView: FC = ({}) => {
  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1
          className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8"
          style={{ paddingBottom: "10px" }}
        >
          Why do we need LibrePlex?
        </h1>
        {/* CONTENT GOES HERE */}

        <Box
          display="flex"
          columnGap={"20px"}
          sx={{ mt: "10px", maxWidth: "600px" }}
        >
          {/* <Box display="flex" flexDirection={"column"}>
            <h5 className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-8">
              Background
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
                  maxWidth: "400px",
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "start",
                  alignItems: "start",
                }}
              >
                <ListItem>Ownership of NFT contracts</ListItem>
                <ListItem>Ease of on-boarding</ListItem>
                <ListItem>Developer experience</ListItem>
                <ListItem>Migration tools</ListItem>
                <ListItem>Minimize rent</ListItem>
                <ListItem>Incorporate new use cases</ListItem>
                <ListItem>Future-proofing</ListItem>
              </UnorderedList>
            </Box>
          </Box> */}

          <StyledTabs>
            <TabList>
              <Tab>Community-Driven</Tab>
              <Tab>Future-proofing</Tab>
            </TabList>

            <TabPanels>
              <TabPanel
                pl={"30px"}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                {/* <MetadataBasics /> */}
                <Heading fontSize="xl">From private ownership...</Heading>
                <p>
                  Metadata Token Program, the key Solana NFT contract program
                  that ultimately governs the ownership of digital assets, is
                  owned and maintained by a private company. This poses a risk
                  to the existing ecosystem in terms of increased fees,
                  unilateral design changes and even loss of control of assets.
                </p>

                <Heading fontSize="xl" style={{ paddingTop: "15px" }}>
                  ... to shared control
                </Heading>
                <p>
                  LibrePlex aims to mitigate this problem by introducing a fully
                  community-driven Metadata protocol that is free of commercial
                  interests. The new protocol will be owned by a consortium with
                  distributed deployment keys. In practice this means that
                  unlike today, no single entity can make fundamental changes to
                  the ecosystem that we all depend on.
                </p>
              </TabPanel>
              <TabPanel
                pl={"30px"}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                <Heading fontSize="xl">
                  Benefit of hindsight
                </Heading>
                The Metadata Token Program has been operating for around two
                years now. Durign that time, we have derived many insights and learned
                multiple lessons about how digital assets operate, with innovative use cases
                and creative applications continually emerging.
                
                <Heading fontSize="xl" style={{ paddingTop: "15px" }}>
                  Looking forward
                </Heading>
                Examining the uses cases from applications ranging from NFT-based loans to staking,
                and from fractionalisations to dynamically modifiable traits, we can reach useful abstractions
                and create a new protocol that will better serve the needs of the community in the future.
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
