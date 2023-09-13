// Next, React
import { FC, useEffect } from "react";

// Wallet
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

// Components

// Store
import Background from "@app/components/Background";
import { WhatMakesGreatGrid } from "@app/components/tables/WhatMakesGreatGrid";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
  VStack
} from "@chakra-ui/react";
import { useUserSOLBalanceStore } from "shared-ui";
import router from "next/router";

const info = [
  {
    id: 1,
    header: "Distributed Deployment Keys",
    text: "No single entity can unilaterally make changes that impact or jeopardise the integrity of the applications that depend on the protocol.",
  },
  {
    id: 2,
    header: "Open license held by a Trust",
    text: "The licensing must ensure that any applications utilising the protocol can do so knowing that the nature of the protocol remains constant, to minimise uncertainty and maximise transparency.",
  },
  {
    id: 3,
    header: "Guaranteed fees-free for life",
    text: "Applications built on top of the protocol may introduce fees, but LibrePlex protocol will never do so. This establishes a level playing field to all and enforces predictability and transparency.",
  },
  {
    id: 4,
    header: "Open Source",
    text: "The source of the protocol will be made available on github or similar. After initial launch, any changes will be subject to 30-day vetting and a community vote.",
  },
  {
    id: 5,
    header: "Permissive license",
    text: "Contracts & SDK released under MIT.",
  },
];

export const HomeView: FC = ({}) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const handleClickCosts = () => {
    event.preventDefault();
    router.push("/costs");
  };

  // const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  return (
    <div style={{ overflow: "hidden" }}>
      <Background imageUrl={"heroImage.png"}>
        <VStack display={"flex"} margin={"auto"}>
          <Box>
            <Grid
              templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(1, 1fr)" }}
              mt={"5.5vh"}
              gap={4}
              // mb={10}
            >
              {/* <GridItem
                colSpan={{ base: 0, md: 1 }}
                display={"flex"}
                justifySelf={{ base: "center", md: "flex-end" }}
                mr={2}
              >
                <Box width={"100%"} maxW={"450px"} hideBelow={"md"}>
                  <img src="LibreL.png" height={"100%"} width={"100%"} />
                </Box>
              </GridItem> */}
              <GridItem
                display={"flex"}
                w={"100%"}
                textAlign={{ base: "center", md: "center" }}
                mr={{ base: "45vw", md: "0px" }}
                colSpan={1}
              >
                <Box margin={"auto"}>
                  <Heading size={{ base: "xl", md: "2xl" }} my="3">
                    Community-driven.
                  </Heading>
                  <Heading size={{ base: "xl", md: "2xl" }} my="3">
                    Open Protocol.
                  </Heading>
                  <Heading size={{ base: "xl", md: "2xl" }} my="3">
                    Easy Adoption.
                  </Heading>
                  <Heading size={{ base: "xl", md: "2xl" }} my="3">
                    No Mint Tax.
                  </Heading>
                </Box>
              </GridItem>
            </Grid>
          </Box>{" "}
          <Box maxW="80vw">
            <Box
              sx={{
                "&::-webkit-scrollbar": {
                  width: "10px !important",
                  height: "3px !important",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "grey",
                  borderRadius: "24px",
                  padding: "23px !important",
                },
                "&::-webkit-scrollbar-button": {
                  margin: "23px 0",
                  padding: "23px",
                },
              }}
              className="mockup-code bg-primary border-2 border-[#FFFFFF9f] p-6 px-10 my-2"
            >
              <pre data-prefix=">">
                <code className="truncate">
                  {`git clone git@github.com:LibrePlex/metadata.git`}{" "}
                </code>
              </pre>
            </Box>
          </Box>
        </VStack>
      </Background>
      <div>
        {/* What makes us great. */}
        <Box
          maxWidth={"1250px"}
          p={{ base: "15px", md: "25px" }}
          display={"flex"}
          margin={"auto"}
          flexDir={"column"}
          mt={{ base: "4vh", md: "10vh" }}
        >
          <Heading size="2xl">The Mission.</Heading>
          <Box mt={2} sx={{ maxWidth: "700px" }}>
            <Text fontSize={"md"} color={"gray.100"}>
              To provide a community-driven, open license protocol to the Solana
              SPL Token and NFT community. The protocol must meet the following
              criteria:
            </Text>
          </Box>
          <Box width={"100%"} mt={5}>
            <Grid
              templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
              gap={{ base: 3, md: 6 }}
            >
              {info.map((info) => (
                <WhatMakesGreatGrid
                  key={info.id}
                  header={info.header}
                  text={info.text}
                />
              ))}
            </Grid>
          </Box>
        </Box>

        {/* From private ownership... */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              margin: "auto",
              top: 0,
              right: 0,
              bottom: 150,
              left: 450,
              width: "200px",
              height: "200px",
              borderRadius: "100%",
              filter: "blur(120px)", // Adjust the blur effect as per your preference
              background:
                "linear-gradient(138deg, rgba(168,21,208,1) 0%, rgba(73,57,184,1) 100%)",
              opacity: "70%",
              zIndex: -1,
            }}
          />
          <Box
            maxWidth={"1250px"}
            p={{ base: "15px", md: "25px" }}
            display={"flex"}
            margin={"auto"}
            flexDir={"column"}
            mt={"5vh"}
          >
            <Heading size="2xl">From private ownership...</Heading>
            <Box mt={2} sx={{ maxWidth: "700px" }}>
              <Text fontSize={"md"} color={"gray.200"}>
                Metadata Token Program, the key Solana NFT contract program that
                ultimately governs the ownership of digital assets, is owned and
                maintained by a private company. This poses a risk to the
                existing ecosystem in terms of increased fees, unilateral design
                changes and even loss of control of assets.
              </Text>
            </Box>
            <Heading textAlign={"right"} mt={4} size="2xl">
              ...to shared control.
            </Heading>
            <Box
              mt={2}
              display={"flex"}
              alignSelf={"end"}
              sx={{ maxWidth: "700px" }}
            >
              <Text textAlign={"right"} fontSize={"md"} color={"gray.200"}>
                LibrePlex aims to mitigate this problem by introducing a fully
                community-driven Metadata protocol that is free of commercial
                interests. The new protocol will be owned by a consortium with
                distributed deployment keys. In practice this means that unlike
                today, no single entity can make fundamental changes to the
                ecosystem that we all depend on.
              </Text>
            </Box>
            <Button
              onClick={handleClickCosts}
              mt={5}
              size={"lg"}
              alignSelf={"flex-end"}
              variant={"outline"}
            >
              Compare Prices
            </Button>
          </Box>
        </div>

        {/* Want to help out? */}
        <Box
          backgroundColor={"black"}
          display={"flex"}
          p={{ base: "15px", md: "25px" }}
          mt={"10vh"}
          borderTop={"1px"}
          borderBottom={"1px"}
          justifyContent={"center"}
        >
          <Grid
            templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(5, 1fr)" }}
            maxW={"1100px"}
            gap={4}
          >
            <GridItem colSpan={3}>
              <Box>
                <Heading size="lg" my="2" textAlign={"center"}>
                  Want to help out?
                </Heading>
                <Text textAlign={"center"}>
                  We are NOT a team, but a collection of teams across the Solana
                  ecosystem. We are independent of commercial interests. We
                  depend on contributions from technologists, influencers,
                  designers, documenters and anybody else who wants to lend a
                  hand. Despite and because of our independence, we have already
                  secured the support of wallets, utility providers and
                  launchpads across Solana.
                </Text>
              </Box>
            </GridItem>
            <GridItem colSpan={2} margin={"auto"}>
              <Stack>
                <Button
                  variant={"outline"}
                  w={"100%"}
                  h={"fit-content"}
                  p={3}
                  mb={1}
                  as={"a"}
                  href="http://discord.gg/libreplex"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <VStack>
                    <Heading size={"md"}>Join us on Discord</Heading>
                    <Text color={"gray.400"}>http://discord.gg/libreplex</Text>
                  </VStack>
                </Button>
                <Button
                  variant={"outline"}
                  h={"fit-content"}
                  w={"100%"}
                  mt={5}
                  p={3}
                  as={"a"}
                  href="https://twitter.com/LibrePlex"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <VStack>
                    <Heading size={"md"}>Follow us on Twitter</Heading>
                    <Text color={"gray.200"}>
                      https://twitter.com/LibrePlex
                    </Text>
                  </VStack>
                </Button>
              </Stack>
            </GridItem>
          </Grid>
        </Box>
      </div>
    </div>
  );
};
