import { FC } from "react";
import { SignMessage } from "../../components/SignMessage";
import { SendTransaction } from "../../components/SendTransaction";
import { SendVersionedTransaction } from "../../components/SendVersionedTransaction";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Card,
  Divider,
  Grid,
  Heading,
  ListItem,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { StyledTabs } from "components/tabs/Tabs";
import { MetadataBasics } from "./MetadataBasics";
import { CollectionBasics } from "./CollectionBasics";
import { RoyaltiesBasics } from "./RoyaltiesBasics";
import { CreatorVerificationBasics } from "./CreatorVerificationBasics";
import { DesignObjectivesGrid } from "components/tables/DesignObjectivesGrid";

const info = [
  {
    id: 1,
    header: "Retain Existing Functionality",
  },
  {
    id: 2,
    header: "Ease of Onboarding",
  },
  {
    id: 3,
    header: "Developer Experience",
  },
  {
    id: 4,
    header: "Migration Tools",
  },
  {
    id: 5,
    header: "Migration Tools",
  },
  {
    id: 6,
    header: "Minimize Rent",
  },
  {
    id: 7,
    header: "Incorporate New Use Cases",
  },
  {
    id: 8,
    header: "Future-Proofing",
  },
];

export const BasicsView: FC = ({}) => {
  return (
    <>
      <Box
        margin={"auto"}
        width={"100%"}
        pt={"5vh"}
        maxW={1000}
        mt={5}
        pr={{ md: 10, base: 3 }}
        pl={{ md: 10, base: 3 }}
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              margin: "auto",
              top: "10vh",
              right: 0,
              bottom: 150,
              left: "-75vw",
              width: "200px",
              height: "200px",
              borderRadius: "100%",
              filter: "blur(120px)", // Adjust the blur effect as per your preference
              background:
                "linear-gradient(138deg, rgba(168,21,208,1) 0%, rgba(73,57,184,0.5) 100%)",
              opacity: "70%",
              zIndex: -1,
            }}
          />
          <Heading textAlign={"left"} size={"2xl"}>
            We make integration easy
          </Heading>
          <Spacer paddingBottom={3} />
          <Heading color={"gray.200"} textAlign={"left"} size={"lg"}>
            Key Design Objectives
          </Heading>
          {/* <Spacer paddingBottom={5}/> */}
          <Divider
            display={"flex"}
            margin={"auto"}
            w={{ base: "100%", md: "90%" }}
            mt={4}
            mb={4}
          />
          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
            gap={{ base: 3, md: 4 }}
          >
            {info.map((info) => (
              <DesignObjectivesGrid key={info.id} header={info.header} />
            ))}
          </Grid>
        </div>

        <Card
          margin={"auto"}
          mt={"8vh"}
          borderRadius={"15px"}
          variant={"outline"}
          backgroundColor={"#00000000"}
          display="flex"
          columnGap={"20px"}
          maxW={"1000px"}
        >
          <StyledTabs>
            <TabList>
              <Tab>
                <Heading
                  color={"gray.200"}
                  textAlign={"center"}
                  size={{ md: "md", base: "sm" }}
                >
                  Metadata
                </Heading>
              </Tab>
              <Tab>
                {" "}
                <Heading
                  color={"gray.200"}
                  textAlign={"center"}
                  size={{ md: "md", base: "sm" }}
                >
                  Collections
                </Heading>
              </Tab>
              <Tab>
                {" "}
                <Heading
                  color={"gray.200"}
                  textAlign={"center"}
                  size={{ md: "md", base: "sm" }}
                >
                  Royalties
                </Heading>
              </Tab>
              <Tab>
                {" "}
                <Heading
                  color={"gray.200"}
                  textAlign={"center"}
                  size={{ md: "md", base: "sm" }}
                >
                  Creator Verification
                </Heading>
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  p: 0,
                }}
              >
                <Accordion allowToggle width={"100%"}>
                  <AccordionItem>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="center">
                        <Heading
                          color={"gray.200"}
                          size={{ md: "md", base: "sm" }}
                        >
                          Unchanged
                        </Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>Name</AccordionPanel>
                  </AccordionItem>

                  <AccordionItem>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="center">
                        <Heading
                          color={"gray.200"}
                          size={{ md: "md", base: "sm" }}
                        >
                          Propose to Change
                        </Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pl={6} pb={4} pr={6}>
                      <Text>Off-chain attributes made optional</Text>
                      <Divider m={1} width={"95%"} />
                      <Text>Authority moved to collection</Text>
                      <Divider m={1} width={"95%"} />
                      <Text>Symbol moved to collection</Text>
                      <Divider m={1} width={"95%"} />
                      <Text>
                        Creators (verified status removed from royalty array)
                      </Text>
                      <Divider m={1} width={"95%"} />
                      <Text>
                        Royalties (handled independently from creators)
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="center">
                        <Heading
                          color={"gray.200"}
                          size={{ md: "md", base: "sm" }}
                        >
                          New
                        </Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pl={6} pb={4} pr={6}>
                      <Text>
                        Creator verification (done independently from royalties)
                      </Text>
                      <Divider m={1} width={"95%"} />
                      <Text>On-chain attributes</Text>
                      <Divider m={1} width={"95%"} />
                      <Text>URL to allow base64 and ordinals</Text>
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="center">
                        <Heading
                          color={"gray.200"}
                          size={{ md: "md", base: "sm" }}
                        >
                          Active Discussion
                        </Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pl={6} pb={4} pr={6}>
                      <Text>Delegation types</Text>
                      <Divider m={1} width={"95%"} />
                      <Text>
                        Royalty enforcement mechanism (token-2022 -v- metadata)
                      </Text>
                      <Divider m={1} width={"95%"} />
                      <Text>Dynamic rendering engines / modes</Text>
                      <Divider m={1} width={"95%"} />
                      <Text>Licensing</Text>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </TabPanel>

              <TabPanel
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  p: 0,
                }}
              >
                <Accordion allowToggle width={"100%"}>
                  <AccordionItem>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="center">
                        <Heading
                          color={"gray.200"}
                          size={{ md: "md", base: "sm" }}
                        >
                          Propose to Change
                        </Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pl={6} pb={4} pr={6}>
                      {" "}
                      <Text>Collection mints removed</Text>
                      <Divider m={1} width={"95%"} />
                      <Text>Collection account introduced</Text>
                      <Divider m={1} width={"95%"} />
                      <Text>
                        Update authority held at collection level (w/ optional
                        overrides at mint level)
                      </Text>
                      <Divider m={1} width={"95%"} />
                      <Text>
                        Royalties specified at collection level (w/ optional
                        overrides at mint level)
                      </Text>
                      <Divider m={1} width={"95%"} />
                      <Text>
                        Royalty bps (formerly seller_fee_basis_points at
                        collection level) (w/ optional overrides at mint level)
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </TabPanel>

              <TabPanel
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  p: 0,
                }}
              >
                <Accordion allowToggle width={"100%"}>
                  <AccordionItem>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="center">
                        <Heading
                          color={"gray.200"}
                          size={{ md: "md", base: "sm" }}
                        >
                          Propose to Change
                        </Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pl={6} pb={4} pr={6}>
                      {" "}
                      <Text>
                        Royalty enforcement will continue. The exact mechanism
                        is under discussion (whether token 2022 if possible or
                        native to LibrePlex).
                      </Text>
                      <Divider m={1} width={"95%"} />
                      <Text>
                        Royalties will be specified independently of creator
                        signatures.
                      </Text>
                      <Divider m={1} width={"95%"} />
                      <Text>
                        Royalties can be specified either at collection level or
                        with individual overrides at mint level.
                      </Text>
                      <Divider m={1} width={"95%"} />
                      <Text>
                        Royalty share granularity will increase from percentage
                        to basis points.
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </TabPanel>

              <TabPanel
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  p: 0,
                }}
              >
                <Accordion allowToggle width={"100%"}>
                  <AccordionItem>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="center">
                        <Heading
                          color={"gray.200"}
                          size={{ md: "md", base: "sm" }}
                        >
                          Propose to Change
                        </Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pl={6} pb={4} pr={6}>
                      {" "}
                      <Text>
                        Creator verification will be independent of royalties.
                      </Text>
                      <Divider m={1} width={"95%"} />
                      <Text>Proposed flow is as follows:</Text>
                      <Text>
                        1. Update authority establishes a list of permitted
                        signers (can be done either at collection level or
                        overridden at mint level)
                      </Text>
                      <Text>
                        2. Signer signs the mint. The signatures are permanent
                        and cannot be removed once signed, akin to a physical
                        signature on a work of art.
                      </Text>
                      <Divider m={1} width={"95%"} />
                      <Text>
                        Separating creator verification from royalties
                        eliminates some odd workarounds like having creators
                        with 0% royalty share taking up UI space and incurring
                        unnecessary rent.
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </TabPanel>
            </TabPanels>
          </StyledTabs>
        </Card>
      </Box>

      {/* CONTENT GOES HERE */}

      {/* <SignMessage />
      <SendTransaction />
      <SendVersionedTransaction /> */}
    </>
  );
};
