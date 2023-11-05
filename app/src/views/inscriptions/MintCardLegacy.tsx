import { Box, BoxProps, HStack, Heading, VStack } from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import React, { ReactNode, useMemo } from "react";
import { LegacyMint } from "@libreplex/shared-ui";
import { AssetDisplay } from "@libreplex/shared-ui";
import { motion } from "framer-motion";
import Link from "next/link";
import { decodeMetadata } from "shared-ui/src/sdk/query/legacymetadata";
import { useFetchOffchainMetadata } from "app/src/hooks/useOffChainMetadata";

const textMotion = {
  default: {
    color: "#ffffff",
  },
  hover: {
    color: "#9448FF",
  },
};

export const MintCardLegacy = ({
  mint,
  children,
  ...rest
}: {
  mint: LegacyMint;

  children?: ReactNode;
} & BoxProps) => {
  const metadata = useMemo(
    () =>
      mint.metadata?.pubkey &&
      mint.metadata?.item?.data &&
      decodeMetadata(
        Buffer.from(mint.metadata.item?.data),
        mint.metadata.pubkey
      ),
    [mint.metadata]
  );

  const { data: offchainData } = useFetchOffchainMetadata(
    metadata?.item.data.uri
  );

  return (
    <Box
      {...rest}
      maxW={"200px"}
      minW={"200px"}
      as={motion.div}
      initial="default"
      whileHover="hover"
    >
      <Link href={`/scanner?mintId=${mint.mint.toBase58()}`}>
        <div style={{ pointerEvents: "none" }}>
          <AssetDisplay
            asset={{ image: { url: offchainData?.image, description: "" } }}
            mint={mint.mint}
          />
        </div>
      </Link>

      <VStack
        style={{ paddingTop: 12 }}
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <Link href={`/scanner?mintId=${mint.mint.toBase58()}`}>
          <Heading
            title={metadata?.item?.data.name ?? "-"}
            as={motion.p}
            size="md"
            noOfLines={1}
            variants={textMotion}
          >
            {/* {JSON.stringify(mint.metadata.item?.data)} */}
            {metadata?.item?.data.name ?? "-"}{" "}
          </Heading>
        </Link>
        {children}
      </VStack>
    </Box>
  );
};
