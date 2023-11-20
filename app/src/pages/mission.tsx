"use client";

function Feature({ title, desc, ...rest }) {
  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      {...rest}
    >
      <Heading fontSize="xl">{title}</Heading>
      <Text mt={4}>{desc}</Text>
    </Box>
  );
}

import { Box, Heading, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import React from "react";
export const Mission = () => {
  return (
    <Box
      w={"100vw"}
      h={"100vh"}
      display={"flex"}
      flexDirection={"column"}
      sx={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        rowGap={1}
      >
        <Box p={1}>
          <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
            Mission
          </h1>
          <p className="text-slate-500 text-2x1 leading-relaxed">
            To create a future-proof, decentralized and fully open source Digital Asset Standard for Solana. mission of LibrePlex is to provide a community-driven, open
            license protocol to the Solana SPL Token and NFT community. The
            protocol must meet the following criteria:
          </p>
        </Box>
        <Feature
          title="Distributed deployment keys"
          desc="No single entity can unilaterally make changes that
              impact or jeopardise the integrity of the applications that depend
              on the protocol."
        />
        <Feature
          title="Open license held by a Trust / Foundation"
          desc="The licensing must ensure that any applications utilising the
          protocol can do so knowing that the nature of the protocol remains
          constant, to minimise uncertainty and maximise transparency."
        />
        <Feature
          title="Guaranteed fees-free Metadata for life"
          desc="Applications built on top of the protocol
          may introduce fees, but LibrePlex protocol will never do so. This
          establishes a level playing field to all and enforces predictability
          and transparency."
        />

        <Feature
          title="Open source"
          desc="Open source The source of the protocol will be made available on
          github or similar. After initial launch, any changes will be subject
          to 30-day vetting and a community vote."
        />

        <Feature
          title="Permissive license"
          desc="Contracts & SDK released under MIT. License will be held by Trust / Foundation."
        />
      </Box>
    </Box>
  );
};

export default Mission;
