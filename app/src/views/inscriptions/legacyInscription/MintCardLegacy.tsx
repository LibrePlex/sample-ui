import { useFormattedNumber } from "@app/utils/useFormattedNumber";
import {
  Badge,
  Box,
  BoxProps,
  Heading,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { TbRefresh } from "react-icons/tb";
import {
  AssetDisplay,
  CopyPublicKeyButton,
  getInscriptionDataPda,
  getInscriptionPda,
  getLegacyMetadataPda,
  useInscriptionForMint,
} from "@libreplex/shared-ui";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useFetchOffchainMetadata } from "app/src/hooks/useOffChainMetadata";
import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode, useMemo } from "react";
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

  const { data: offchainData } = useFetchOffchainMetadata(
    metadata?.item.data.uri
  );

  const {
    data: inscription,
    refetch,
    isFetching,
  } = useInscriptionForMint(mintId);

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
        <VStack sx={{ position: "absolute", top: "5px", right: "5px" }}>
          <Badge
            sx={{
              border: "1px solid #aaa",
              background: "#333",
            }}
          >
            Order: {inscription.item.order.toNumber().toLocaleString()}
          </Badge>
          <Badge
            sx={{
              border: "1px solid #aaa",
              background: "#333",
            }}
          >
            Size: {formattedSize}
          </Badge>
        </VStack>
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
            <IconButton
              style={{ position: "absolute", top: "8px", left: "8px" }}
              size="xs"
              onClick={() => refetch()}
              aria-label={"Refresh"}
            >
              <TbRefresh />
            </IconButton>
            {/* <CopyPublicKeyButton
              style={{ position: "absolute", top: "8px", left: "8px" }}
              size="xs"
              onClick={() => refetch()}
              aria-label={"Copy inscription id"}
              publicKey={inscriptionId?.toBase58()}
            /> */}

            {children}
          </VStack>
        </>
      )}
    </Box>
  );
};
