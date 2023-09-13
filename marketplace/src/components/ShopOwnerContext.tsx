import React, { ReactNode, createContext } from "react";
import { PublicKey } from "@solana/web3.js";
import { Box, Center, Heading, Text, VStack } from "@chakra-ui/react";

export interface IShopOwnerContext {
  ownerPublicKey: PublicKey;
}

export const ShopOwnerContext = createContext<IShopOwnerContext>(undefined!);

export const ShopOwnerProvider = ({ children }: { children: ReactNode }) => {
  return process.env.NEXT_PUBLIC_SHOP_OWNER_PUBLICKEY ? (
    <ShopOwnerContext.Provider
      value={{
        ownerPublicKey: new PublicKey(
          process.env.NEXT_PUBLIC_SHOP_OWNER_PUBLICKEY
        ),
      }}
    >
      {children}
    </ShopOwnerContext.Provider>
  ) : (
    <Box>
      <Center height={"100vh"}>
        <VStack>
          <Heading>Shop owner not specified.</Heading>
          <Text>
            Please add the following line to your .env file (or environment
            variable on vercel / heroku /etc):
          </Text>
          <Text>NEXT_PUBLIC_SHOP_OWNER_PUBLICKEY={"<your wallet key>"}</Text>
          <Text>... when done, refresh this page and you will be GTG!</Text>
        </VStack>
      </Center>
    </Box>
  );
};
