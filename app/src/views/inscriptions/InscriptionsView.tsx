import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";
import { InscriptionsSummary } from "./InscriptionsSummary";
import {
  CustomMintsInscriber
} from "./legacyInscription/collectioninscriber/CustomMintsInscriber";
import { MyMintsInscriber } from "./legacyInscription/collectioninscriber/MyMintsInscriber";
import { InscriptionGallery } from "./legacyInscription/holderinscriber/InscriptionGallery";

enum View {
  InscriptionGallery,
  Inscriber,
  CustomMints,
}

const InscriptionsView = () => {
  const [view, setView] = useState<View>(View.InscriptionGallery);

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Libreplex Inscriptions
        </h1>

        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Are you FOC?
        </h1>

        <Box
          display="flex"
          columnGap={"20px"}
          flexDirection="column"
          className="w-full"
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
              <InscriptionsSummary mt={4} mb={4} />
              <Box
                mt={6}
                sx={{
                  display: "flex",
                }}
                gap={1}
              >
                <Button
                  colorScheme={
                    view === View.InscriptionGallery ? "teal" : "white"
                  }
                  variant={
                    view === View.InscriptionGallery ? "solid" : "outline"
                  }
                  onClick={() => {
                    setView(View.InscriptionGallery);
                  }}
                >
                  Browse Inscriptions
                </Button>
                <Button
                  colorScheme={view === View.Inscriber ? "teal" : "white"}
                  variant={view === View.Inscriber ? "solid" : "outline"}
                  onClick={() => {
                    setView(View.Inscriber);
                  }}
                >
                  View your wallet
                </Button>
                <Button
                  colorScheme={view === View.CustomMints ? "teal" : "white"}
                  variant={view === View.CustomMints ? "solid" : "outline"}
                  onClick={() => {
                    setView(View.CustomMints);
                  }}
                >
                  View custom inscriptions
                </Button>
              </Box>
              {view === View.InscriptionGallery && <InscriptionGallery />}
              {view === View.Inscriber && <MyMintsInscriber />}
              {view === View.CustomMints && <CustomMintsInscriber />}
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
