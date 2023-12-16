import {
  Center,
  HStack,
  Heading,
  Image,
  Link,
  SimpleGrid,
  Skeleton,
  Text,
  VStack,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  Flex,
  Box,
} from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { useMemo, useState } from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import {
  SolscanLink,
  getInscriptionV3Pda,
  useInscriptionDataForRoot,
  useInscriptionV3ForRoot,
  useOffChainMetadataCache,
} from "../..";
import { TensorButton } from "../migration/MarketButtons";
import { InscriptionImage } from "./InscriptionImage";
import { InscriptionV1V2 } from "./InscriptionV1V2";
import { MutabilityDisplay } from "./MutabilityDisplay";
import { useUrlPrefixForInscription } from "./useUrlPrefixForInscription";
import { useMediaPrefix } from "./useMediaPrefix";
import { ClaimExcessRentTransactionButton } from "./buttons/ClaimExcessRentTransactionButtonAsUauth";

export const InscriptionTable = ({ mint }: { mint: PublicKey }) => {
  const {
    inscription: {
      data: inscription,
      isFetching: isFetchingInscription,
      refetch: refreshInscription,
    },
  } = useInscriptionV3ForRoot(mint);
  const {
    data: inscriptionData,
    isFetching: isFetchingInscriptionData,
    refetch: refreshInscriptionData,
  } = useInscriptionDataForRoot(mint);

  const inscriptionV3Pda = useMemo(() => getInscriptionV3Pda(mint)[0], [mint]);

  const { data: offchainData } = useOffChainMetadataCache(mint);

  const urlPrefix = useUrlPrefixForInscription(inscription);

  const { mediaType, base64ImageInscription, asciiImageInscription } =
    useMediaPrefix(mint);

  const { publicKey } = useWallet();

  return (
    <VStack columnGap={2} className="relative">
      <HStack>
        <Heading size="lg">
          Order #{Number(inscription?.item.order ?? 0).toLocaleString()}
        </Heading>
      </HStack>
      <ClaimExcessRentTransactionButton params={{ mint }} formatting={{}} />
      
      <MutabilityDisplay inscription={inscription} />
      
      <SimpleGrid columns={2} spacing={10} className="min-h-300 h-300">
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
                      height: "300px",
                      maxHeight: "300px",
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
                minHeight: "300px",
                maxHeight: "300px",
                aspectRatio: "1/1",
                borderRadius: 8,
              }}
            />
          )}
        </VStack>
        <VStack className="relative">
          {base64ImageInscription ? (
            urlPrefix === "application/text" || urlPrefix === "text/plain" ? (
              <Center
                sx={{ height: "100%", minHeight: "300px", maxHeight: "300px" }}
              >
                <Text color="white">{asciiImageInscription}</Text>
              </Center>
            ) : (
              <InscriptionImage root={mint} />
            )
          ) : (
            <>
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
          <HStack className="absolute top-8 p-2">
            <Popover size="md">
              <PopoverTrigger>
                <Button colorScheme="teal" variant="solid">
                  Base64
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <Box p={3} sx={{ maxHeight: "50vh", overflow: "auto" }}>
                  {base64ImageInscription}
                </Box>
              </PopoverContent>
            </Popover>
            <Popover size="md">
              <PopoverTrigger>
                <Button colorScheme="teal" variant="solid">
                  Ascii
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <Box p={3} sx={{ maxHeight: "50vh", overflow: "auto" }}>
                  {asciiImageInscription}
                </Box>
              </PopoverContent>
            </Popover>
          </HStack>
        </VStack>
        <VStack>
          <Link target="_blank" href={offchainData?.images.url}>
            View Original
          </Link>
        </VStack>

        <VStack>
          <Text mt={3}>{mediaType?.slice(0, 15)}</Text>

          <HStack>
            <Text>View inscription account</Text>
            {inscriptionV3Pda && (
              <SolscanLink address={inscriptionV3Pda.toBase58()} />
            )}
          </HStack>
          <HStack>
            <Text>View data account</Text>
            {inscriptionData && (
              <SolscanLink address={inscriptionData.pubkey?.toBase58()} />
            )}
          </HStack>
        </VStack>
      </SimpleGrid>

      {publicKey?.toBase58()?.startsWith("5LufDW6Mtb") && (
        <InscriptionV1V2 mint={mint} />
      )}
    </VStack>
  );
};
