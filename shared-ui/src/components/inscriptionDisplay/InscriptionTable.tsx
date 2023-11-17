import {
  Center,
  HStack,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  VStack,
  SimpleGrid,
  Image,
  Link,
  Heading,
} from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { useContext, useMemo } from "react";

import React from "react";
import {
  CopyPublicKeyButton,
  SolscanLink,
  mediaTypeToString,
  useInscriptionDataForRoot,
  useInscriptionForRoot,
  useMediaType,
  useOffChainMetadataCache,
} from "../..";
import { ClusterContext } from "../../contexts/NetworkConfigurationProvider";
import { InscriptionImage } from "./InscriptionImage";
import { useUrlPrefixForInscription } from "./useUrlPrefixForInscription";
import { useValidationHash } from "./useValidationHash";

export const InscriptionTable = ({ mint }: { mint: PublicKey }) => {
  const {
    inscriptionId,
    inscription: {
      data: inscription,
      isFetching: isFetchingInscription,
      refetch: refreshInscription,
    },
  } = useInscriptionForRoot(mint);
  const {
    data: inscriptionData,
    isFetching: isFetchingInscriptionData,
    refetch: refreshInscriptionData,
  } = useInscriptionDataForRoot(mint);

  const hashOfInscription = useValidationHash(inscriptionData?.item?.buffer);

  const { data: offchainData } = useOffChainMetadataCache(mint);

  const urlPrefix = useUrlPrefixForInscription(inscription);
  const base64ImageInscription = useMemo(
    () =>
      urlPrefix === "application/text"
        ? Buffer.from(inscriptionData?.item?.buffer ?? []).toString("ascii")
        : Buffer.from(inscriptionData?.item?.buffer ?? []).toString("base64"),
    [inscriptionData?.item?.buffer, urlPrefix]
  );

  const mediaType = useMemo(
    () =>
      inscription?.item.mediaType
        ? mediaTypeToString(inscription?.item.mediaType)
        : undefined,
    [inscription]
  );

  return (
    <Table>
      <Tbody>
        <Tr>
          <Td>
            <Center columnGap={2}>
              <SimpleGrid columns={2} spacing={10} className="min-h-300 h-300">
                <Center>
                  <Heading size="md">Off-chain Image</Heading>
                </Center>
                <Center>
                  <Heading size="md">FOC Inscription</Heading>
                </Center>
                <VStack>
                  {offchainData?.images.square ? (
                    <Image
                      className="aspect-square rounded-md"
                      style={{ minHeight: "200px" }}
                      src={offchainData?.images.square}
                      fallback={
                        <Skeleton isLoaded={true}>
                          <img
                            src="https://img.freepik.com/premium-vector/gallery-simple-icon-vector-image-picture-sign-neumorphism-style-mobile-app-web-ui-vector-eps-10_532800-801.jpg"
                            style={{
                              height: "100%",
                              width: "100%",
                              borderRadius: "20px",
                            }}
                          />
                        </Skeleton>
                      }
                    />
                  ) : (
                    <Skeleton
                      startColor="#aaa"
                      endColor="#aaa"
                      style={{
                        minHeight: "200px",
                        maxHeight: "100%",
                        aspectRatio: "1/1",
                        borderRadius: 8,
                      }}
                    />
                  )}
                </VStack>
                <VStack>
                  {base64ImageInscription ? (
                    urlPrefix === "application/text" ? (
                      <Center sx={{ height: "100%", minHeight: "200px" }}>
                        <Text color="white">{base64ImageInscription}</Text>
                      </Center>
                    ) : (
                      <InscriptionImage
                        stats={true}
                        root={mint}
                        sx={{ minHeight: "100%" }}
                      />
                    )
                  ) : (
                    <>
                      <Text
                        sx={{
                          position: "absolute",
                          left: "50%",
                          top: "45%",
                          transform: "translate(-50%,-50%)",
                        }}
                      >
                        Not inscribed
                      </Text>
                      <Skeleton
                        startColor="#aaa"
                        endColor="#aaa"
                        style={{
                          minHeight: "100%",
                          aspectRatio: "1/1",
                          borderRadius: 8,
                        }}
                      />
                    </>
                  )}
                </VStack>
                <VStack>
                  <Link target="_blank" href={offchainData?.images.url}>
                    View Original
                  </Link>
                </VStack>

                <VStack>
                  <Text>Inscription Data</Text>
                  <Text>{mediaType}</Text>
                  {inscriptionData && (
                    <SolscanLink address={inscriptionData.pubkey?.toBase58()} />
                  )}
                </VStack>
              </SimpleGrid>
            </Center>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
};
