import { Box, BoxProps, HStack, Heading, VStack } from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { ReactNode, useContext } from "react";
import {
  LibrePlexProgramContext,
  ScannerLink,
  useMetadataByMintId,
} from "shared-ui";
import { AssetDisplay } from "./assetdisplay/AssetDisplay";

export const MintCard = ({
  mint,
  children,
  ...rest
}: {
  mint: PublicKey;
  children?: ReactNode; 
} & BoxProps) => {
  const {} = useContext(LibrePlexProgramContext);
  const { connection } = useConnection();
  const metadata = useMetadataByMintId(mint, connection);

  return (
    <Box {...rest} maxW={"200px"} minW={"200px"}>
      <AssetDisplay asset={metadata?.item?.asset} />

      <VStack style={{paddingTop: 12}}>
        <HStack>
          <Heading size="md">{metadata?.item?.name ?? "-"}</Heading>
          <ScannerLink mintId={mint} />
        </HStack>
        {children}
      </VStack>
    </Box>
  );
};
