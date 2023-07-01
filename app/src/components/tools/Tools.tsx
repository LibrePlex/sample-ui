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
      <HStack>
        <Button
          colorScheme="teal"
          variant={view === View.PnftMigrationFixer ? "solid" : "ghost"}
        >
          pNFT Fixer
        </Button>
      </HStack>
      <Box sx={{height :"100%"}}>
        {view === View.PnftMigrationFixer && <PNFTFixer />}
      </Box>

      {/* <Text>
        The tools are free to use, though donations are welcome. If you find the
        tools useful, make sure you follow us:
      </Text>

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
            <Text color={"gray.400"}>https://twitter.com/LibrePlex</Text>
          </VStack>
        </Button>
      </Stack> */}
    
    </Box>
  );
};
