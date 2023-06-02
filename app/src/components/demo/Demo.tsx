import {
    Box,
    Button,
    Heading,
    LinkBox,
    LinkOverlay,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Text,
} from "@chakra-ui/react";
import { StyledTabs } from "components/tabs/Tabs";
import { Collection } from "generated/libreplex";
import { useState } from "react";
import { EditCollectionDialog } from "./collections/EditCollectionDialog";
import { CollectionsPanel } from "./collections/CollectionsPanel";
export const Demo = () => {
  const [editorStatus, setEditorStatus] = useState<{
    open: boolean;
    collection: Collection | undefined;
  }>({
    open: false,
    collection: undefined,
  });
  return (
    <Box
      sx={{
        maxWidth: "600px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      rowGap={3}
    >
      <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
        Metadata Manager
      </h1>

      <StyledTabs>
        <TabList>
          <Tab>Collections</Tab>
          <Tab>Metadata</Tab>
          <Tab>Repos</Tab>
          {/* <Tab>Royalties</Tab>
          <Tab>Creator verification</Tab> */}
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
            <Button
              onClick={() =>
                setEditorStatus({ open: true, collection: undefined })
              }
            >
              Create Collection
            </Button>
            <EditCollectionDialog
              open={editorStatus.open}
              onClose={() => {
                setEditorStatus({
                  open: false,
                  collection: undefined,
                });
              }}
            />
            <CollectionsPanel/>
          </TabPanel>
          <TabPanel></TabPanel>
          <TabPanel>
            <Box display="flex" columnGap={2}>
              <LinkBox
                as="article"
                maxW="sm"
                p="5"
                borderWidth="1px"
                rounded="md"
              >
                <Heading size="md" my="2">
                  <LinkOverlay href="https://github.com/LibrePlex/metadata">
                    Contracts
                  </LinkOverlay>
                </Heading>
                <Text>Released under MIT License</Text>
                <Text>Click here for the repo!</Text>
                <Text>https://github.com/LibrePlex/metadata</Text>
              </LinkBox>
              <LinkBox
                as="article"
                maxW="sm"
                p="5"
                borderWidth="1px"
                rounded="md"
              >
                <Heading size="md" my="2">
                  <LinkOverlay href="https://github.com/LibrePlex/sample-ui">
                    Reference UI (this website)
                  </LinkOverlay>
                </Heading>
                <Text>Released under Apache 2.0 License</Text>
                <Text>Click here for the repo!</Text>
                <Text>https://github.com/LibrePlex/sample-ui</Text>
              </LinkBox>
            </Box>
          </TabPanel>
        </TabPanels>
      </StyledTabs>
    </Box>
  );
};
