import { Box, BoxProps, HStack, Heading, VStack } from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import React, { ReactNode, useContext, useMemo } from "react";
import {
  LegacyMint,
  decodeInscription,
  getInscriptionPda,
} from "@libreplex/shared-ui";
import { AssetDisplay } from "@libreplex/shared-ui";
import { motion } from "framer-motion";
import Link from "next/link";
import { decodeMetadata } from "shared-ui/src/sdk/query/legacymetadata";
import { useFetchOffchainMetadata } from "app/src/hooks/useOffChainMetadata";
import { useFetchSingleAccount } from "shared-ui/src/sdk/query/singleAccountInfo";
import { InscriptionsProgramContext } from "shared-ui/src/sdk/query/inscriptions/InscriptionsProgramContext";
import { MintCardLegacy } from "./MintCardLegacy";

const textMotion = {
  default: {
    color: "#ffffff",
  },
  hover: {
    color: "#9448FF",
  },
};

export const InscriptionCardLegacy = ({
  inscriptionId,
  children,
}: {
  inscriptionId: PublicKey;

  children?: ReactNode;
} & BoxProps) => {
  const { connection } = useConnection();

  const program = useContext(InscriptionsProgramContext);
  const inscriptionAccount = useFetchSingleAccount(inscriptionId, connection);
  const inscription = useMemo(
    () =>
      inscriptionId &&
      inscriptionAccount?.data?.item?.buffer &&
      decodeInscription(program)(
        inscriptionAccount?.data?.item?.buffer,
        inscriptionId
      ),
    [inscriptionId, inscriptionAccount?.data?.item?.buffer, program]
  );

  return <MintCardLegacy mintId={inscription?.item.root} />;
};
