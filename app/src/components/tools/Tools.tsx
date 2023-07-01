import {
  Box,
  Button,
  Collapse,
  HStack,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { PNFTFixer } from "./PNFTFixer";

enum View {
  PnftMigrationFixer,
}

export const Tools = () => {
  const { publicKey } = useWallet();
  const [view, setView] = useState<View>(View.PnftMigrationFixer);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
      rowGap={3}
    >
      <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-10 pb-5">
        Free tools from the LibrePlex Team.
      </h1>
      <Box width="100%" display="flex" flexDir={"column"} alignItems={"center"}>
        <Stack maxWidth={"500px"}>
          <Text maxWidth={"500px"} textAlign={"center"}>
            These tools are free to use. If you find them helpful, please follow
            us!{" "}
          </Text>

          <Text maxWidth={"500px"} textAlign={"center"}>
            We are independent and unfunded - for a more decentralized Solana,
            we need grass-roots support from people like you!
          </Text>
          <VStack>
            <Button
              variant={"outline"}
              w={"100%"}
              h={"fit-content"}
              p={3}
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
              p={3}
              as={"a"}
              href="https://twitter.com/LibrePlex"
              target="_blank"
              rel="noopener noreferrer"
            >
              <VStack>
                <Heading size={"md"}>Follow us on Twitter</Heading>
                <Text color={"gray.400"}>https://twitter.com/LibrePlex</Text>
              </VStack>
            </Button>
          </VStack>
        </Stack>
      </Box>
      <HStack>
        <Button
          colorScheme="teal"
          variant={view === View.PnftMigrationFixer ? "solid" : "ghost"}
        >
          pNFT Fixer
        </Button>
      </HStack>
      <Box sx={{ height: "100%" }}>
        {view === View.PnftMigrationFixer && <PNFTFixer />}
      </Box>
    </Box>
  );
};
