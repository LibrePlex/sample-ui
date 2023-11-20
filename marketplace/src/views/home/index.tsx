// Next, React
import { FC, useEffect } from "react";

// Wallet
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

// Components

// Store
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import Background from "../../components/Background";
import router from "next/router";
import {useUserSolBalanceStore} from  "@libreplex/shared-ui";
import React from "react";

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
    header: "Guaranteed fees-free Metadata for life",
    text: "Applications built on top of the metadata protocol may introduce fees, but LibrePlex metadata protocol will never do so. This establishes a level playing field to all and enforces predictability and transparency.",
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

  const { getUserSOLBalance } = useUserSolBalanceStore();

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
                    LibrePlex marketplace.
                  </Heading>
                  <Heading size={{ base: "xl", md: "2xl" }} my="3">
                    Open Source.
                  </Heading>
                  <Heading size={{ base: "xl", md: "2xl" }} my="3">
                    Roll your own.
                  </Heading>
                  <Heading size={{ base: "xl", md: "2xl" }} my="3">
                    No fees.
                  </Heading>
                </Box>
              </GridItem>
            </Grid>
          </Box>{" "}
        </VStack>
      </Background>
      <div>
       

      
      </div>
    </div>
  );
};
