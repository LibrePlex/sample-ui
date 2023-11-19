import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input
} from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useContext, useEffect, useState } from "react";

import {
  MetadataProgramContext,
  MintDisplay,
  SolscanLink,
  useMetadataByMintId,
  usePublicKeyOrNull
} from "@libreplex/shared-ui";

import { ClusterContext } from "@shared-ui/contexts/NetworkConfigurationProvider";
import { useRouter } from "next/router";

export const LibreScanner = () => {
  const [mintId, setMintId] = useState<string>("");
  const mintPublicKey = usePublicKeyOrNull(mintId);

  const { connection } = useConnection();

  const router = useRouter();

  useEffect(() => {
    if (router.query.mintId && mintId !== router.query.mintId) {
      setMintId((router.query.mintId ?? "") as string);
    }
  }, [router?.query]);

  useEffect(() => {
    if (mintPublicKey && router.query.mintId !== mintPublicKey?.toBase58()) {
      router.query.mintId = mintPublicKey.toBase58();
      router.push(
        {
          pathname: "/scanner",
          query: { ...router.query, mintId: mintPublicKey.toBase58() },
        },
        undefined,
        {}
      );
    }
  }, [router, mintPublicKey]);

  const { cluster } = useContext(ClusterContext);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxWidth: "600px",
      }}
      rowGap={3}
      pb={10}
    >
      <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-10 pb-5">
        LibreScan - View Metadata
      </h1>

      <FormControl>
        <FormLabel>Mint ID</FormLabel>

        <HStack>
          <Input
            placeholder="Mint ID"
            value={mintId}
            onChange={(e) => setMintId(e.currentTarget.value)}
          />
          <SolscanLink address={mintId} cluster={cluster} />
        </HStack>
      </FormControl>

      
      {mintPublicKey && <MintDisplay mint={mintPublicKey} />}
    </Box>
  );
};
