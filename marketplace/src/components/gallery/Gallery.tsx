import { Button, HStack, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { Listings } from "./Listings";
import { Items } from "./Items";

enum View {
  Listings,
  MyWallet,
}

export const Gallery = () => {
  const [view, setView] = useState<View>(View.Listings);
  return (
    <VStack>
      <HStack>
        <Button
          colorScheme="teal"
          variant={view === View.Listings ? "solid" : "outline"}
          onClick={() => {
            setView(View.Listings);
          }}
        >
          Listings
        </Button>
        <Button
          colorScheme="teal"
          variant={view === View.MyWallet ? "solid" : "outline"}
          onClick={() => {
            setView(View.MyWallet);
          }}
        >
          My wallet
        </Button>
      </HStack>
      {view === View.Listings ? <Listings/> : <Items/>}
    </VStack>   
  );
};
