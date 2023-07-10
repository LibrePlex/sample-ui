import {
  Box,
  BoxProps,
  Button,
  Collapse,
  FormControl,
  FormLabel,
  Heading,
  Input,
  LinkBox,
  LinkOverlay,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ReactNode, useEffect, useState } from "react";
import { CollectionsPanel } from "./collections/CollectionsPanel";
import useSelectedPermissions from "./permissions/useSelectedPermissions";
import { BaseMetadataPanel } from "./metadata/MetadataPanel";

import {
  useGroupById,
  useMetadataById,
  useMetadataByMintId,
  useNetworkConfiguration,
  usePublicKeyOrNull,
} from "shared-ui";
import { JsonViewer } from "./JsonViewer";
import dynamic from "next/dynamic";

const ReactJson = dynamic(import("react-json-view"), { ssr: false });

export const LibreScanner = () => {
  const { networkConfiguration } = useNetworkConfiguration();

  const [mintId, setMintId] = useState<string>("");
  const mintPublicKey = usePublicKeyOrNull(mintId);

  const { connection } = useConnection();
  const metadata = useMetadataByMintId(mintPublicKey, connection);

  const group = useGroupById(metadata?.item.group, connection);

  const [clientSide, setClientSide] = useState<boolean>(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setClientSide(true);
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      rowGap={3}
    >
      <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-10 pb-5">
        LibreScan - View Libre Metadata
      </h1>
      <FormControl>
        <FormLabel>Mint ID</FormLabel>

        <Input
          placeholder="Mint ID"
          value={mintId}
          onChange={(e) => setMintId(e.currentTarget.value)}
        />
      </FormControl>
      <Heading size="md">Metadata</Heading>
      <ReactJson theme="monokai" src={metadata ?? {}} />
      <Heading size="md">Group</Heading>
      <ReactJson theme="monokai" src={group ?? {}} />
    </Box>
  );
};
