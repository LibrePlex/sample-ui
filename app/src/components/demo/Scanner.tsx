import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text
} from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useContext, useEffect, useState } from "react";

import {
  CopyPublicKeyButton,
  MetadataProgramContext,
  MintDisplay,
  PROGRAM_ID_METADATA,
  useGroupById,
  useMetadataByMintId,
  usePublicKeyOrNull
} from "shared-ui";

import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";

export const LibreScanner = () => {
  const [mintId, setMintId] = useState<string>("");
  const mintPublicKey = usePublicKeyOrNull(mintId);

  const { connection } = useConnection();
  const metadata = useMetadataByMintId(mintPublicKey, connection);

  const { setProgramId, program } = useContext(MetadataProgramContext);

  const [programIdOverride, setProgramIdOverride] = useState<string>("");

  const programIdOverridePubkey = usePublicKeyOrNull(programIdOverride);

  const group = useGroupById(metadata?.item.group, connection);

  const router = useRouter();

  useEffect(() => {
    if (router.query.mintId) {
      setMintId((router.query.mintId ?? "") as string);
    }
  }, [router?.query]);

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

        <Input
          placeholder="Mint ID"
          value={mintId}
          onChange={(e) => setMintId(e.currentTarget.value)}
        />
      </FormControl>
      <HStack>
        <Text>Program ID</Text>{" "}
        <CopyPublicKeyButton publicKey={program.programId.toBase58()} />
      </HStack>
      <HStack>
        <FormControl>
          <Input
            placeholder="Override program id"
            value={programIdOverride}
            onChange={(e) => setProgramIdOverride(e.currentTarget.value)}
          />
        </FormControl>
        {programIdOverridePubkey &&
          !programIdOverridePubkey.equals(program.programId) && (
            <Button
              onClick={() => {
                setProgramId(programIdOverridePubkey);
              }}
            >
              Override
            </Button>
          )}
        {!program.programId?.equals(new PublicKey(PROGRAM_ID_METADATA)) && (
          <Button
            onClick={() => {
              setProgramId(new PublicKey(PROGRAM_ID_METADATA));
            }}
          >
            Default
          </Button>
        )}
      </HStack>
      {mintPublicKey && <MintDisplay mint={mintPublicKey} />}
    </Box>
  );
};
