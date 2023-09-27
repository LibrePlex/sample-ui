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
import React, { ReactNode, useMemo, useState } from "react";
import { AssetDisplay, CopyPublicKeyButton } from ".";
import { useCollectionById, useMetadataByMintId } from "../sdk";
import { AttributesDisplayDefault } from "./attributedisplay/AttributesDisplayDefault";
import { AttributesDisplayChainRenderer } from "./attributedisplay/AttributesDisplayChainRenderer";

const ReactJson = dynamic(import("react-json-view"), { ssr: false });

enum View {
  Params,
  Attributes,
  Metadata,
  Group,
}

export const MintDisplay = ({
  mint,
  actions,
}: {
  mint: PublicKey;
  actions?: ReactNode;
}) => {
  const { connection } = useConnection();
  const metadata = useMetadataByMintId(mint, connection);

  const [view, setView] = useState<View>(View.Attributes);

  const group = useCollectionById(metadata?.item?.collection ?? null, connection);

  return metadata?.item ? (
    <VStack gap={8} alignItems="center" width={"100%"} maxWidth={"650px"}>
      <HStack alignItems="flex-start" width={"100%"} flexWrap="wrap" gap={4}>
        <VStack
          maxHeight="330px"
          minHeight="330px"
          aspectRatio={"1/1"}
          align="center"
        >
          <AssetDisplay asset={metadata.item.asset} mint={mint} />
          <Heading size="md" noOfLines={1}>
            {metadata.item.name}
          </Heading>
        </VStack>

        <Table maxW={"300px"}>
          <Tbody>
            <Tr>
              <Td>Name</Td>
              <Td>{metadata?.item.name}</Td>
            </Tr>
            <Tr>
              <Td>Metadata</Td>
              <Td>
                {metadata && (
                  <CopyPublicKeyButton publicKey={metadata.pubkey.toBase58()} />
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
              <Td>Mutable</Td>
              <Td>
                <span>{metadata?.item.isMutable.toString()}</span>
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

      <Box>{actions}</Box>

      <VStack
        justify={"start"}
        h={"100%"}
        // maxH={"330px"}
        align={"start"}
        maxW={"646px"}
        minW={"100%"}
        gap={4}
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
            Collection
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
                {metadata.item.asset.chainRenderer ? (
                  <AttributesDisplayChainRenderer
                    asset={metadata.item.asset.chainRenderer}
                    mint={mint}
                  />
                ) : (
                  <AttributesDisplayDefault
                    group={{ ...group, item: group.item! }}
                    attributes={[
                      ...(metadata?.item.extension?.nft?.attributes ?? []),
                    ]}
                  />
                )}
              </Box>
            ) : (
              <></>
            )
          ) : view === View.Metadata ? (
            <ReactJson
              style={{
                wordBreak: "break-word",
              }}
              theme="monokai"
              src={metadata ?? {}}
            />
          ) : view === View.Group ? (
            <Box>
              <HStack mb={4}>
                <Heading size="md">Collection</Heading>

                <CopyPublicKeyButton
                  publicKey={metadata?.item?.collection?.toBase58()}
                />
              </HStack>
              <Box>
                <ReactJson
                  theme="monokai"
                  style={{
                    wordBreak: "break-word",
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
    </VStack>
  ) : (
    <Box>Missing metadata</Box>
  );
};
