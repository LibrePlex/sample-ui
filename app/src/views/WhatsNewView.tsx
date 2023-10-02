import {
  Box,
  Heading,
  ListItem,
  UnorderedList,
  Text,
  List,
} from "@chakra-ui/react";
import Head from "next/head";

export const WhatsNewView = () => {
  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1
          className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8"
          style={{ paddingBottom: "10px" }}
        >
          New and Improved Formula!!
        </h1>
        
        <Box
          display="flex"
          columnGap={"20px"}
          sx={{ mt: "10px", maxWidth: "800px" }}
          flexDirection="column"
        >
          <Box display="flex" flexDirection={"column"}>
            <Box
              sx={{
                mt: 0,
                pt: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pb: 5,
              }}
            >
              <UnorderedList
                rowGap={3}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "start",
                  alignItems: "start",
                }}
              >
                <ListItem listStyleType="none">
                  <Box rowGap={2} display={"flex"} flexDir={"column"}>
                    <Heading size={"lg"}>Dynamic Rendering</Heading>
                    <Text maxW={"500px"}>
                      Allows you to define a custom on-chain program that
                      produces a media for each mint. The media can be
                      interactive, animated, or anything else you like!
                    </Text>
                    <Text maxW={"500px"}>Examples:</Text>
                    <UnorderedList>
                      <ListItem>Assets with a day/night cycle</ListItem>
                      <ListItem>Seasonal assets</ListItem>
                      <ListItem>
                        Native trait-swap: Custom rendering depending on
                        attributes etc
                      </ListItem>
                    </UnorderedList>
                  </Box>
                </ListItem>
                <ListItem listStyleType="none">
                  <Box rowGap={2} display={"flex"} flexDir={"column"}>
                    <Heading size={"lg"}>Inscriptions</Heading>
                    <Text maxW={"500px"}>
                      Fully on-chain media without any web2 components such as
                      arweave, shadow drive etc.
                    </Text>
                    <Text maxW={"500px"}>
                      With inscriptions, you own your assets. They exist as long
                      as solana does.
                    </Text>
                  </Box>
                </ListItem>
                <ListItem listStyleType="none">
                  <Box rowGap={2} display={"flex"} flexDir={"column"}>
                    <Heading size={"lg"}>On-chain attributes</Heading>
                    <Text maxW={"500px"}>
                      Allow building of custom utility (such as attribute-based
                      staking, trait swaps etc) without having to involve web2
                      components.
                    </Text>
                  </Box>
                </ListItem>
                <ListItem listStyleType="none">
                  <Box rowGap={2} display={"flex"} flexDir={"column"}>
                    <Heading size={"lg"}>Native Licensing</Heading>
                    <Text maxW={"500px"}>
                      Licensing built into the asset contracts.
                    </Text>
                    <Text maxW={"500px"}>
                      {'"The holder of this NFT is allowed to print 37 copies of the NFT on a t-shirt of their choice."'}
                    </Text>
                  </Box>
                </ListItem>
              </UnorderedList>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};
