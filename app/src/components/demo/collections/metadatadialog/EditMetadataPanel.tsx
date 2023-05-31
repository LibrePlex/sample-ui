import { InfoIcon } from "@chakra-ui/icons";
import { useMemo, useState } from "react";

import { Box, Button, Collapse, Heading, Stack, Text } from "@chakra-ui/react";

import { PublicKey } from "@solana/web3.js";

import { IRoyaltyShare } from "anchor/interfaces/IRoyaltyShare";
import { IRpcObject } from "components/executor/IRpcObject";
import { usePublicKeyOrNull } from "hooks/usePublicKeyOrNull";
import { Collection } from "query/collections";
import { AddMintToCollection } from "./AddMintToCollection";
import { MintNewToCollection } from "./MintNewToCollection";

enum View {
  MintNew = "Mint new",
  AddMint = "Add mint",
}

export const EditMetadataPanel = ({
  collection,
  onSuccess,
}: {
  collection: IRpcObject<Collection>;
  onSuccess: () => any;
}) => {
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const [view, setView] = useState<View>(View.MintNew);

  return (
    <Stack spacing={4}>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Button
          onClick={() => {
            setShowInfo((old) => !old);
          }}
        >
          <InfoIcon />
        </Button>
        <Collapse in={showInfo}>
          <Text sx={{ maxWidth: "500px" }}>
            An LibrePlex standard, each metadata item belongs to a collection,
            including SPL tokens. You can create metadata in the selected
            collection here.
          </Text>
        </Collapse>
      </Box>
      <Box display="flex" flexDirection={"column"} alignItems="center">
        <Text sx={{ maxWidth: "500px" }}>
          The selected collection ({collection.item.name}) has
        </Text>
        <Heading>
          {Number(collection.item.itemCount.toString()).toLocaleString()}
        </Heading>
        <Text sx={{ maxWidth: "500px" }}>items</Text>
        <Box
          sx={{
            display: "flex",
          }}
          gap={1}
        >
          <Button
            colorScheme="teal"
            variant={view === View.MintNew ? "solid" : "outline"}
            onClick={()=>{
              setView(View.MintNew)
            }}
          >
            Mint new
          </Button>
          <Button
            colorScheme="teal"
            variant={view === View.AddMint ? "solid" : "outline"}
            onClick={()=>{
              setView(View.AddMint)
            }}
          >
            Add mint
          </Button>
          {/* <Button>Mint new</Button> */}
        </Box>
      </Box>
      {view === View.MintNew ? (
        <MintNewToCollection collection={collection} />
      ) : (
        <AddMintToCollection collection={collection} />
      )}
    </Stack>
  );
};
