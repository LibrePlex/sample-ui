import {
  Badge,
  Box,
  BoxProps,
  HStack,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import React, { ReactNode, useContext, useMemo } from "react";
import {
  LegacyMint,
  decodeInscription,
  getInscriptionPda,
  getLegacyMetadataPda,
} from "@libreplex/shared-ui";
import { AssetDisplay } from "@libreplex/shared-ui";
import { motion } from "framer-motion";
import Link from "next/link";
import { decodeMetadata } from "shared-ui/src/sdk/query/legacymetadata";
import { useFetchOffchainMetadata } from "app/src/hooks/useOffChainMetadata";
import { useFetchSingleAccount } from "shared-ui/src/sdk/query/singleAccountInfo";
import { InscriptionsProgramContext } from "shared-ui/src/sdk/query/inscriptions/InscriptionsProgramContext";

const textMotion = {
  default: {
    color: "#ffffff",
  },
  hover: {
    color: "#9448FF",
  },
};

export const MintCardLegacy = ({
  mintId,
  children,
  ...rest
}: {
  mintId: PublicKey | undefined;

  children?: ReactNode;
} & BoxProps) => {
  const { connection } = useConnection();

  const metadataId = useMemo(
    () => (mintId ? getLegacyMetadataPda(mintId)[0] : undefined),
    [mintId]
  );

  const metadataAccount = useFetchSingleAccount(metadataId, connection);
  const metadata = useMemo(
    () =>
      metadataId &&
      metadataAccount?.data?.item?.buffer &&
      decodeMetadata(metadataAccount?.data?.item?.buffer, metadataId),
    [metadataId, metadataAccount]
  );

  const { data: offchainData } = useFetchOffchainMetadata(
    metadata?.item.data.uri
  );

  const inscriptionId = useMemo(
    () => (mintId ? getInscriptionPda(mintId)[0] : undefined),
    [mintId]
  );

  const { data: inscriptionAccount, refetch } = useFetchSingleAccount(
    inscriptionId,
    connection
  );

  const program = useContext(InscriptionsProgramContext);

  const inscription = useMemo(
    () =>
      decodeInscription(program)(
        inscriptionAccount?.item?.buffer,
        inscriptionAccount?.pubkey
      ),
    [inscriptionAccount, program]
  );

  return (
    <Box
      {...rest}
      maxW={"200px"}
      minW={"200px"}
      as={motion.div}
      initial="default"
      whileHover="hover"
      sx={{position :"relative", ...rest.sx}}
    >
      {inscription?.item && (
        <Badge sx={{position: "absolute", top: '5px', right :"5px", border: '1px solid #eee', background :"#333"}}>Rank {inscription.item.rank.toNumber().toLocaleString()}</Badge>
      )}
      {mintId && (
        <>
          <Link href={`/scanner?mintId=${mintId.toBase58()}`}>
            <div style={{ pointerEvents: "none" }}>
              <AssetDisplay
                asset={{ image: { url: offchainData?.image, description: "" } }}
                mint={mintId}
              />
            </div>
          </Link>

          <VStack
            style={{ paddingTop: 12 }}
            alignItems="flex-start"
            justifyContent="flex-start"
          >
            <Link href={`/scanner?mintId=${mintId.toBase58()}`}>
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
        </>
      )}
    </Box>
  );
};
