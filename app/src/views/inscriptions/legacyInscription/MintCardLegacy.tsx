import { useFormattedNumber } from "@app/utils/useFormattedNumber";
import {
  Badge,
  Box,
  BoxProps,
  Heading,
  IconButton,
  VStack,
  Text,
  Center,
} from "@chakra-ui/react";
import {
  AssetDisplay,
  getInscriptionPda,
  getLegacyMetadataPda,
  useOffChainMetadataCache,
  useInscriptionForRoot,
} from "@libreplex/shared-ui";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode, useEffect, useMemo } from "react";
import { HiMagnifyingGlassCircle } from "react-icons/hi2";
import { TbRefresh } from "react-icons/tb";
import { decodeLegacyMetadata } from "shared-ui/src/sdk/query/legacymetadata";
import { useFetchSingleAccount } from "shared-ui/src/sdk/query/singleAccountInfo";
const textMotion = {
  default: {
    color: "#ffffff",
  },
  hover: {
    color: "#9448FF",
  },
};

export enum InscriptionFilter {
  With,
  Without,
  Both,
}

export const MintCardLegacy = ({
  mintId,
  children,
  filter,
  ...rest
}: {
  filter?: {
    inscriptions: InscriptionFilter;
  };
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
      decodeLegacyMetadata(metadataAccount?.data?.item?.buffer, metadataId),
    [metadataId, metadataAccount]
  );

  const { data: offchainData } = useOffChainMetadataCache(mintId);

  const {
    inscription: { data: inscription, refetch, isFetching },
  } = useInscriptionForRoot(mintId);

  const inscriptionId = useMemo(
    () => (mintId ? getInscriptionPda(mintId)[0] : undefined),
    [mintId]
  );

  const formattedSize = useFormattedNumber(inscription?.item?.size ?? 0, 0);

  return (
    <Box
      {...rest}
      maxW={"200px"}
      minW={"200px"}
      as={motion.div}
      initial="default"
      whileHover="hover"
      sx={{ position: "relative", ...rest.sx }}
    >
      {inscription?.item && (
        <div
          className="flex flex-col items-end absolute top-2 right-2 z-10"
        >
          <Badge
            sx={{
              border: "1px solid #aaa",
              background: "#333",
            }}
          >
            #{inscription.item.order.toNumber().toLocaleString()}
          </Badge>
          <Badge
            sx={{
              border: "1px solid #aaa",
              background: "#333",
            }}
          >
            Size: {formattedSize}B
          </Badge>
          <Badge
            sx={{
              border: "1px solid #aaa",
              background: "#333",
            }}
          >
             Rent: {(Math.round((0.00089088 + 0.00000696 * inscription?.item?.size)*100)/100).toFixed(2)} SOL
          </Badge>
        </div>
      )}
      {mintId && (
        <>
          <Box sx={{ height: "200px" }}>
            <AssetDisplay
              asset={{
                image: { url: offchainData?.images.square, description: "" },
              }}
              mint={mintId}
            />
          </Box>
          <IconButton
            style={{ position: "absolute", top: "8px", left: "8px" }}
            size="xs"
            onClick={() => refetch()}
            aria-label={"Refresh"}
          >
            <TbRefresh />
          </IconButton>

          <VStack
            display={"flex"}
            flexDir={"row"}
            style={{ paddingTop: 12 }}
            alignItems="center"
            justifyContent="center"
            gap={2}
          >
            <Heading
              title={metadata?.item?.data.name ?? "-"}
              // as={motion.p}
              size="md"
              noOfLines={1}
            >
              <Center>{metadata?.item?.data.name ?? "-"} </Center>
            </Heading>
            <Box>
              <IconButton
                size="xs"
                p={0}
                onClick={() =>
                  window.open(`/scanner?mintId=${mintId.toBase58()}`)
                }
                aria-label={"Scanner"}
              >
                <HiMagnifyingGlassCircle size={"lg"} />
              </IconButton>
            </Box>

            {children}
          </VStack>
        </>
      )}
    </Box>
  );
};
