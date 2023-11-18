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
  useInscriptionForRoot,
  useLegacyMetadataByMintId,
  useMetadataByMintId,
  useOffChainMetadataCache,
} from "@libreplex/shared-ui";
import { PublicKey } from "@solana/web3.js";
import { motion } from "framer-motion";
import { ReactNode, useMemo } from "react";
import { HiMagnifyingGlassCircle } from "react-icons/hi2";
import { Immutability } from "./immutability/Immutability";
import { InscriptionImage } from "shared-ui/src/components/inscriptionDisplay/InscriptionImage";
import { useConnection } from "@solana/wallet-adapter-react";
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
        <div className="flex flex-col items-end absolute top-2 right-2 z-10 gap-1">
          <Badge
            sx={{
              // border: "1px solid #aaa",
              background: "#333",
            }}
          >
            Rent:{" "}
            {(
              Math.round(
                (0.00089088 + 0.00000696 * inscription?.item?.size) * 100
              ) / 100
            ).toFixed(2)}{" "}
            SOL
          </Badge>
          <Badge
            sx={{
              // border: "1px solid #aaa",
              background: "#333",
            }}
          >
            Size: {formattedSize}B
          </Badge>
          <Badge
            sx={{
              // border: "1px solid #aaa",
              background: "#333",
            }}
          >
            #{inscription.item.order.toNumber().toLocaleString()}
          </Badge>
          
          
        </div>
      )}
      {mintId && (
        <>
          <Box sx={{ height: "200px" }} >
            {/* <Center sx={{ height: "100%", width: "100%" }}>
              <VStack p={4} justifyContent={'end'} sx={{height :"100%"}}>
                <Text color="white">
                  We are busy! 
                  No image preview.
                  Click scanner icon below to
                  view this item.
                </Text>
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
              </VStack>
            </Center> */}
            {/* {inscription?.item && (
              <InscriptionImage
                stats={true}
                root={inscription.item.root}
                sx={{ minHeight: "100%" }}
              />
            )} */}
            <AssetDisplay
              asset={{
                image: { url: offchainData?.images.square, description: "" },
              }}
              mint={mintId}
            />
          </Box>
          <Box className="absolute top-2 left-2">
            <Immutability inscription={inscription} />
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
              <Center>{itemName ?? "-"} </Center>
            </Heading>

            {/* <Box>
              
            </Box> */}

            {children}
          </VStack>
        </>
      )}
    </Box>
  );
};
