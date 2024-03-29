import { Box, BoxProps, Heading, VStack } from "@chakra-ui/react";
import {
  AssetDisplay,
  MetadataProgramContext,
  useMetadataByMintId
} from "@libreplex/shared-ui";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useContext } from "react";

const textMotion = {
  default: {
    color: "#ffffff",
  },
  hover: {
    color: "#9448FF",
  },
};

export const MintCard = ({
  mint,
  children,
  ...rest
}: {
  mint: PublicKey;
  children?: ReactNode;
} & BoxProps) => {
  const {} = useContext(MetadataProgramContext);
  const { connection } = useConnection();
  const metadata = useMetadataByMintId(mint, connection);
  const router = useRouter();

  return (
    <Box
      {...rest}
      maxW={"200px"}
      minW={"200px"}
      as={motion.div}
      initial="default"
      whileHover="hover"
    >
      <Link href={`/mint/${metadata?.item?.mint}`}>
        <div style={{ pointerEvents: "none" }}>
          <AssetDisplay asset={metadata?.item?.asset} mint={mint} />
        </div>
      </Link>

      <VStack
        style={{ paddingTop: 12 }}
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <Link href={`/mint/${metadata?.item?.mint}`}>
          <Heading
            title={metadata?.item?.name ?? "-"}
            as={motion.p}
            size="md"
            noOfLines={1}
            variants={textMotion}
          >
            {" "}
            {metadata?.item?.name ?? "-"}{" "}
          </Heading>
        </Link>
        {children}
      </VStack>
    </Box>
  );
};
