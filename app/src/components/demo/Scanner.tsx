import {
  Box,
  BoxProps,
  Button,
  Collapse,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Heading,
  Input,
  LinkBox,
  LinkOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  VStack,
  useMediaQuery,
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ReactNode, useContext, useEffect, useState } from "react";
import { CollectionsPanel } from "./collections/CollectionsPanel";
import useSelectedPermissions from "./permissions/useSelectedPermissions";
import { BaseMetadataPanel } from "./metadata/MetadataPanel";

import {
  AssetDisplay,
  CopyPublicKeyButton,
  LibrePlexProgramContext,
  LibrePlexProgramProvider,
  PROGRAM_ID_METADATA,
  useGroupById,
  useMetadataById,
  useMetadataByMintId,
  useNetworkConfiguration,
  usePublicKeyOrNull,
} from "shared-ui";
import { JsonViewer } from "./JsonViewer";
import dynamic from "next/dynamic";
import { PublicKey } from "@solana/web3.js";
import { AttributesPanel } from "./collections/editCollectionDialog/AttributesPanel";
import { AttributesDisplay } from "../metadata/AttributesDisplay";
import { useRouter } from "next/router";

const ReactJson = dynamic(import("react-json-view"), { ssr: false });

enum View {
  Params,
  Attributes,
}

export const LibreScanner = () => {
  const [mintId, setMintId] = useState<string>("");
  const mintPublicKey = usePublicKeyOrNull(mintId);

  const { connection } = useConnection();
  const metadata = useMetadataByMintId(mintPublicKey, connection);

  const { setProgramId, program } = useContext(LibrePlexProgramContext);

  const [programIdOverride, setProgramIdOverride] = useState<string>("");

  const programIdOverridePubkey = usePublicKeyOrNull(programIdOverride);

  const group = useGroupById(metadata?.item.group, connection);

  const [view, setView] = useState<View>(View.Params);

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
      {metadata && (
        <Box sx={{ display: "flex", flexDirection: "column" }} gap={3}>
          <VStack gap={2}>
            <HStack gap={2} justify={"start"} w="100%" maxH={"330px"}>
              <VStack maxH={"300px"} aspectRatio={"1/1"} align='center'>
                <AssetDisplay asset={metadata.item.asset} />
                <Heading size="md">{metadata.item.name}</Heading>
              </VStack>
              <VStack justify={"start"} h={"100%"} align={"start"}>
                <HStack>
                  <Button
                    colorScheme="teal"
                    onClick={() => {
                      setView(View.Params);
                    }}
                    variant={view === View.Params ? "solid" : "outline"}
                  >
                    Params
                  </Button>
                  <Button
                    colorScheme="teal"
                    onClick={() => {
                      setView(View.Attributes);
                    }}
                    variant={view === View.Attributes ? "solid" : "outline"}
                  >
                    Attributes
                  </Button>
                </HStack>
                {view === View.Params ? (
                  <Table>
                    <Tbody>
                      <Tr>
                        <Td>Name</Td>
                        <Td>{metadata?.item.name}</Td>
                      </Tr>
                      <Tr>
                        <Td>Metadata</Td>
                        <Td>
                          {metadata && (
                            <CopyPublicKeyButton
                              publicKey={metadata.pubkey.toBase58()}
                            />
                          )}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Uauth</Td>
                        <Td>
                          <CopyPublicKeyButton
                            publicKey={metadata?.item.updateAuthority.toBase58()}
                          />
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Group</Td>
                        <Td>
                          {metadata?.item?.group ? (
                            <CopyPublicKeyButton
                              publicKey={metadata?.item.group.toBase58()}
                            />
                          ) : (
                            "-"
                          )}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                ) : (
                  <AttributesDisplay
                    group={group}
                    attributes={[
                      ...(metadata?.item.extension?.nft?.attributes ?? []),
                    ]}
                  />
                )}
              </VStack>
            </HStack>
          </VStack>
          <ReactJson
            theme="monokai"
            src={metadata ?? {}}
          />
          <HStack>
            <Heading size="md">Group</Heading>

            <CopyPublicKeyButton
              publicKey={metadata?.item?.group?.toBase58()}
            />
          </HStack>
          <ReactJson theme="monokai" src={group ?? {}} />
        </Box>
      )}
    </Box>
  );
};
