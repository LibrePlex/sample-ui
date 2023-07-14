import {
  Box,
  BoxProps,
  Heading,
  VStack
} from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { ReactNode, useContext } from "react";
import { LibrePlexProgramContext, useMetadataByMintId } from "shared-ui";
import { AssetDisplay } from "./assetdisplay/AssetDisplay";


export const MintCard = ({
  mint,
  children,
  ...rest
}: {
  mint: PublicKey;
  children?: ReactNode;
}  & BoxProps) => {
  const {} = useContext(LibrePlexProgramContext)
  const { connection } = useConnection();
  const metadata = useMetadataByMintId(mint, connection);

  return (
    <Box {...rest} maxW={"200px"} minW={"200px"}>
      <AssetDisplay asset={metadata?.item?.asset} />

      <VStack>
        <Heading size="md">{metadata?.item?.name??'-'}</Heading>
        {children}
      </VStack>
    </Box>
  );
};
