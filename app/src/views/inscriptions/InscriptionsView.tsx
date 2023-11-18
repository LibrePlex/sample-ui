
import {
  Box,
  Button,
  Heading,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import {
  MintWithTokenAccount,
  useInscriptionForRoot,
} from "@libreplex/shared-ui";
import { useState } from "react";
import { InscriptionsSummary } from "./InscriptionsSummary";
import { ViewLegacyInscription } from "./legacyInscription/ViewLegacyInscription";
import { LegacyCollectionInscriber } from "./legacyInscription/collectioninscriber/LegacyCollectionInscriber";
import { InscriptionGallery } from "./legacyInscription/holderinscriber/InscriptionGallery";

enum View {
  InscriptionGallery,
  Inscriber,
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
              <UnorderedList>
                {/* <ListItem>
                  <Text fontSize={"2xl"}>
                    FOC FACT #1: The inscription number is forever linked to the
                    mint of the inscription.
                  </Text>
                </ListItem>
                <ListItem>
                  <Text fontSize={"2xl"}>
                    FOC FACT #2: The inscription content CAN CHANGE until it is
                    made immutable. There are NO immutable inscriptions YET.
                  </Text>
                </ListItem>
                <ListItem>
                  <Text fontSize={"2xl"}>
                    FOC FACT #3: The update authority can withdraw rent unless
                    the inscription is immutable. DO NOT IGNORE THIS.
                  </Text>
                </ListItem> */}

                {/* <ListItem>
                  <Text fontSize={"2xl"}>
                    FOC Fact #3: As long as Solana lives, your inscription
                    lives.
                  </Text>
                </ListItem>
                <ListItem>
                  <Text fontSize={"2xl"}>
                    FOC Fact #5: Inscriptions are ranked 1,2,3....
                  </Text>
                </ListItem> */}
                {/* <ListItem>
                  <Text fontSize={"2xl"}>
                    FOC Fact #4: At 2:29am on 16 November 2023, there were 2,497
                    FOC inscriptions.
                  </Text>
                </ListItem> */}
                {/* <ListItem>
                  <Text fontSize={"2xl"}>
                    FOC Fact #5: You can make your inscriptions less blurry by
                    using PNG / SVG instead of JPEG.
                  </Text>
                </ListItem> */}
              </UnorderedList>

              <InscriptionsSummary mt={4} mb={4} />
              <Box
                mt={6}
                sx={{
                  display: "flex",
                }}
                gap={1}
              >
                <Button
                  colorScheme={view === View.Inscriber ? "teal" : "white"}
                  variant={view === View.Inscriber ? "solid" : "outline"}
                  onClick={() => {
                    setView(View.Inscriber);
                  }}
                >
                  Inscribe Yours
                </Button>
                
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
                {/* <Button>Mint new</Button> */}
              </Box>
              {view === View.InscriptionGallery && <InscriptionGallery />}
              {view === View.Inscriber && <LegacyCollectionInscriber />}
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
