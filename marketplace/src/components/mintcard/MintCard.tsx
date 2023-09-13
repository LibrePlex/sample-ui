import { Box, BoxProps, HStack, Heading, VStack } from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import React, { ReactNode, useCallback, useContext } from "react";
import {
  MetadataProgramContext,
  ScannerLink,
  useMetadataByMintId,
} from "@libreplex/shared-ui";
import { AssetDisplay } from "@libreplex/shared-ui";

export const MintCard = ({
  mint,
  children,
  onSelectMint,
  ...rest
}: {
  mint: PublicKey;
  onSelectMint?: (mint: PublicKey) => any,
  children?: ReactNode; 
} & BoxProps) => {
  const {} = useContext(MetadataProgramContext);
  const { connection } = useConnection();
  const metadata = useMetadataByMintId(mint, connection);

  const router = useRouter();


  return (
    <Box {...rest} maxW={"200px"} minW={"200px"} sx={{
      cursor: 'pointer'
    }} onClick={()=>{
      onSelectMint && onSelectMint(mint)
    }}>
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
