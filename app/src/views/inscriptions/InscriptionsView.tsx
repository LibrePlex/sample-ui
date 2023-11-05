import {
  Box,
  Button,
  Heading,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import React from "react";
import { WalletLegacyGallery } from "./WalletLegacyGallery";
import { useWallet } from "@solana/wallet-adapter-react";
import { LegacyMint } from "@libreplex/shared-ui";
import { InscribeLegacyMetadataTransactionButton } from "@app/components/legacyInscriptions/InscribeLegacyMetadataTransactionButton";

const InscriptionsView = () => {
  const { publicKey } = useWallet();

  const actions = (item: LegacyMint) => {
    return (
      <InscribeLegacyMetadataTransactionButton
        params={{ legacyMint: item }}
        formatting={{}}
      />
    );
  };

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1
          className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8"
          style={{ paddingBottom: "10px" }}
        >
          Libreplex Inscriptions
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
              <Heading>Inscriptions Basics</Heading>
              <UnorderedList>
                <ListItem>
                  You own your NFT art, not just a url to offchain storage
                </ListItem>
                <ListItem>Inscriptions live as long as Solana lives</ListItem>
                <ListItem>
                  Inscriptions are ranked 1,2,3,4 ... (like Ordinals)
                </ListItem>
                <ListItem>
                  Inscription rent is recoverable (until the inscription is made
                  immutable)
                </ListItem>
              </UnorderedList>
              <Heading>Holders</Heading>
              <UnorderedList>
                <ListItem>Can inscribe any NFTs in their wallet</ListItem>
                <ListItem>
                  If the NFT is transferred, the inscription travels with it
                </ListItem>
              </UnorderedList>
              <Heading>Projects</Heading>
              <UnorderedList>
                <ListItem>
                  Can inscribe any NFTs you have update auth on
                </ListItem>
                <ListItem>
                  Can make inscriptions immutable to prevent rent recovery
                </ListItem>
              </UnorderedList>
              <WalletLegacyGallery publicKey={publicKey} actions={actions} />
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};
<Box rowGap={2} display={"flex"} flexDir={"column"}>
  <Heading size={"lg"}>Native Licensing</Heading>
  <Text maxW={"500px"}>Licensing built into the asset contracts.</Text>
  <Text maxW={"500px"}>
    {
      '"The holder of this NFT is allowed to print 37 copies of the NFT on a t-shirt of their choice."'
    }
  </Text>
</Box>;
export default InscriptionsView;
