import {
  Box,
  Button,
  Collapse,
  Heading,
  ListItem,
  Text,
  UnorderedList,
  useMediaQuery,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { WalletLegacyGallery } from "./legacyInscription/WalletLegacyGallery";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LegacyMint,
  getInscriptionPda,
  useFetchSingleAccount,
} from "@libreplex/shared-ui";
import { InscribeLegacyMetadataTransactionButton } from "@app/components/legacyInscriptions/InscribeLegacyMetadataTransactionButton";
import { InscriptionsSummary } from "./InscriptionsSummary";
import { InscriptionGallery } from "./legacyInscription/InscriptionGallery";
import { PublicKey } from "@solana/web3.js";
import { EditLegacyInscription } from "./legacyInscription/EditLegacyInscription";

enum View {
  Wallet,
  InscriptionGallery,
}

const InscriptionAction = ({ legacyMint }: { legacyMint: LegacyMint }) => {
  const { connection } = useConnection();
  const inscriptionId = useMemo(() => getInscriptionPda(legacyMint.mint)[0], [legacyMint.mint]);
  const { data } = useFetchSingleAccount(inscriptionId, connection);
  return data?.item?.buffer ? (
    <EditLegacyInscription mint={legacyMint.mint} />
  ) : (
    <InscribeLegacyMetadataTransactionButton
      params={{ legacyMint }}
      formatting={{}}
    />
  );
};

const InscriptionsView = () => {
  
  const actions = (item: LegacyMint) => {
    return <InscriptionAction legacyMint={item} />;
  };

  const {publicKey} = useWallet();
    const [view, setView] = useState<View>(View.InscriptionGallery);

  const [isSmallerThan800] = useMediaQuery("(max-width: 800px)");

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
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
              <InscriptionsSummary mt={4} mb={4} />

              <Box
                display="flex"
                flexDirection={isSmallerThan800 ? "column" : "row"}
                justifyContent={"center"}
                columnGap={2}
                w={[300, 300, 800]}
              >
                <Button
                  colorScheme="orange"
                  variant={
                    view === View.InscriptionGallery ? "solid" : "outline"
                  }
                  onClick={() => {
                    setView(View.InscriptionGallery);
                  }}
                >
                  Inscriptions
                </Button>
                <Button
                  colorScheme="orange"
                  variant={view === View.Wallet ? "solid" : "outline"}
                  onClick={() => {
                    setView(View.Wallet);
                  }}
                >
                  Your Wallet
                </Button>
              </Box>

              {view === View.Wallet && (
                <WalletLegacyGallery publicKey={publicKey} actions={actions} />
              )}
              {view === View.InscriptionGallery && <InscriptionGallery />}
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
