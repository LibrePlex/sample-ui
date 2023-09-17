import {
  Box,
  Button,
  HStack,
  Heading,
  Table,
  Tbody,
  Td,
  Tr,
  VStack,
  Grid,
  GridItem,
  SimpleGrid,
} from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import dynamic from "next/dynamic";
import React, { ReactNode, useState } from "react";
import { AssetDisplay, CopyPublicKeyButton } from ".";
import { useCollectionById, useMetadataByMintId } from "../sdk";
import { AttributesDisplay } from "./assetdisplay/AttributesDisplay";

const ReactJson = dynamic(import("react-json-view"), { ssr: false });

enum View {
  Params,
  Attributes,
  Metadata,
  Group,
}

export const MintDisplay = ({ mint, actions }: { mint: PublicKey, actions?: ReactNode }) => {
  const { connection } = useConnection();
  const metadata = useMetadataByMintId(mint, connection);

  const [view, setView] = useState<View>(View.Attributes);

  const group = useCollectionById(metadata?.item?.collection ?? null, connection);

  return metadata?.item ? (
    <Box sx={{ display: "flex", flexDirection: "column" }} gap={3}>
      <VStack gap={2}>
        <SimpleGrid columns={1} gap={10}>
          <Box height="330px">
            <HStack>
              <VStack
                maxHeight="330px"
                minHeight="330px"
                aspectRatio={"1/1"}
                align="center"
              >
                <AssetDisplay asset={metadata.item.asset} />
                <Heading size="md">{metadata.item.name}</Heading>
              </VStack>

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
                    <Td>Collection</Td>
                    <Td>
                      {metadata?.item?.collection ? (
                        <CopyPublicKeyButton
                          publicKey={metadata?.item.collection.toBase58()}
                        />
                      ) : (
                        "-"
                      )}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </HStack>
          </Box>
          <Box>
            {actions}
          </Box>
          <Box height="330px" maxH={"330px"} maxW={"550px"} >
            <VStack
              justify={"start"}
              h={"100%"}
              maxH={"330px"}
              align={"start"}
              maxW={"100%"}
            >
              <HStack>
                <Button
                  colorScheme="teal"
                  onClick={() => {
                    setView(View.Attributes);
                  }}
                  variant={view === View.Attributes ? "solid" : "outline"}
                >
                  Attributes
                </Button>
                <Button
                  colorScheme="teal"
                  onClick={() => {
                    setView(View.Metadata);
                  }}
                  variant={view === View.Metadata ? "solid" : "outline"}
                >
                  Metadata
                </Button>
                <Button
                  colorScheme="teal"
                  onClick={() => {
                    setView(View.Group);
                  }}
                  variant={view === View.Group ? "solid" : "outline"}
                >
                  Group
                </Button>
              </HStack>
              <Box
                sx={{
                  height: "100%",
                  maxHeight: "100%",
                  maxW: "100%",
                  
                  w: "100%",
                }}
              >
                {view === View.Attributes ? (
                  group?.item ? (
                    <Box
                      maxH={"100%"}
                      overflow={"hidden"}

                      // background='red'
                    >
                      <AttributesDisplay
                        group={{ ...group, item: group.item! }}
                        attributes={[
                          ...(metadata?.item.extension?.nft?.attributes ?? []),
                        ]}
                      />
                    </Box>
                  ) : (
                    <></>
                  )
                ) : view === View.Metadata ? (
                  <ReactJson 
                  style={{
                    wordBreak: 'break-word'
                  }}
                  
                  theme="monokai" src={metadata ?? {}} />
                ) : view === View.Group ? (
                  <Box>
                    <HStack>
                      <Heading size="md">Group</Heading>

                      <CopyPublicKeyButton
                        publicKey={metadata?.item?.collection?.toBase58()}
                      />
                    </HStack>
                    <Box>
                      <ReactJson
                        theme="monokai"
                        style={{
                          wordBreak: 'break-word'
                        }}
                        src={group ?? {}}
                      />
                    </Box>
                  </Box>
                ) : (
                  <></>
                )}
              </Box>
            </VStack>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  ) : (
    <Box>Missing metadata</Box>
  );
};
