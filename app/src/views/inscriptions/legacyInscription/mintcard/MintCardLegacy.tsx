import { useFormattedNumber } from "@app/utils/useFormattedNumber";
import {
  Badge,
  Box,
  BoxProps,
  Center,
  Heading,
  IconButton,
  VStack,
  Text,
} from "@chakra-ui/react";
import {
  AssetDisplay,
  TensorButton,
  useInscriptionForRoot,
  useLegacyMetadataByMintId,
  useMetadataByMintId,
  useOffChainMetadataCache,
} from "@libreplex/shared-ui";
import { PublicKey } from "@solana/web3.js";
import { motion } from "framer-motion";
import { ReactNode, useMemo } from "react";
import { HiMagnifyingGlassCircle } from "react-icons/hi2";
import { Immutability } from "../immutability/Immutability";
import { useConnection } from "@solana/wallet-adapter-react";

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
  const { data: offchainData } = useOffChainMetadataCache(mintId);

  const {
    inscription: { data: inscription, refetch, isFetching },
  } = useInscriptionForRoot(mintId);

  const { connection } = useConnection();
  const metadata = useLegacyMetadataByMintId(mintId, connection);

  const formattedSize = useFormattedNumber(inscription?.item?.size ?? 0, 0);
  const itemName = useMemo(
    () => metadata?.item?.data?.name.replace(/\0/g, "").trim() ?? "-",
    [metadata?.item]
  );
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
        <div className="flex flex-col items-end absolute top-2 right-2 gap-1">
          <Badge
            sx={{
              zIndex: 10,
              background: "#333",
            }}
          >
            Size: {formattedSize}B
          </Badge>
          <Badge
            sx={{
              // border: "1px solid #aaa"
              zIndex: 10,
              background: "#333",
            }}
          >
            #{inscription.item.order.toNumber().toLocaleString()}
          </Badge>
        </div>
      )}
      {mintId && (
        <>
          <Box sx={{ height: "200px", position: "relative" }}>
            <IconButton
              style={{ position: "absolute", bottom: 8, right: 12, zIndex: 10 }}
              size="xs"
              p={0}
              onClick={() =>
                window.open(`/scanner?mintId=${mintId.toBase58()}`)
              }
              aria-label={"Scanner"}
            >
              <HiMagnifyingGlassCircle size={"lg"} />
            </IconButton>

            <AssetDisplay
              asset={{
                image: { url: offchainData?.images.square, description: "" },
              }}
              mint={mintId}
            />
          </Box>
          <Box className="absolute top-3 left-3">
            <Immutability inscription={inscription} />
          </Box>
          <Box className="absolute bottom-11 left-3" >
            <TensorButton mint={inscription.item.root} />
          </Box>

          <VStack
            display={"flex"}
            flexDir={"row"}
            style={{ paddingTop: 12 }}
            alignItems="center"
            justifyContent="center"
            gap={2}
          >
            <Heading
              title={itemName}
              // as={motion.p}
              size="md"
              noOfLines={1}
            >
              <Center><Text className="whitespace-nowrap text-ellipsis">{itemName ?? "-"} </Text></Center>
            </Heading>

            {children}
          </VStack>
        </>
      )}
    </Box>
  );
};
