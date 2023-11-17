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
  Image
} from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { useContext, useMemo } from "react";

import React from "react";
import {
  CopyPublicKeyButton,
  useInscriptionDataForRoot,
  useInscriptionForRoot,
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

  const {data: offchainData} = useOffChainMetadataCache(mint);

  const urlPrefix = useUrlPrefixForInscription(inscription);
  const base64ImageInscription = useMemo(
    () => urlPrefix === 'application/text' ? Buffer.from(inscriptionData?.item?.buffer ?? []).toString("ascii") : Buffer.from(inscriptionData?.item?.buffer ?? []).toString("base64"),
    [inscriptionData?.item?.buffer, urlPrefix]
  );

  

  const { cluster } = useContext(ClusterContext);

  return (
    <Table>
      <Tbody>
        <Tr>
          <Td>
            <Center columnGap={2}>
              <SimpleGrid columns={2} spacing={10} className="min-h-300 h-300">
                <VStack>
                  {offchainData?.images.square ? (
                    <Image
                      className="aspect-square rounded-md"
                      style={{minHeight: '200px'}}
                      src={offchainData?.images.square}
                      fallback={
                        <Skeleton isLoaded={true}>
                          <img
                            src="https://img.freepik.com/premium-vector/gallery-simple-icon-vector-image-picture-sign-neumorphism-style-mobile-app-web-ui-vector-eps-10_532800-801.jpg"
                            style={{ height: "100%", width: "100%", borderRadius: '20px' }}
                          />
                        </Skeleton>
                      }
                    />
                  ) : (
                    <Skeleton
                      startColor="#aaa"
                      endColor="#aaa"
                      style={{
                        minHeight: '200px',
                        maxHeight: "100%",
                        aspectRatio: "1/1",
                        borderRadius: 8,
                      }}
                    />
                  )}
                  <Text>Off-chain Image</Text>
                </VStack>
                <VStack>
                  
                  {base64ImageInscription ? (
                    urlPrefix === 'application/text' ? <Center sx={{height :"100%", minHeight: '200px',}}><Text color='white'>{base64ImageInscription}</Text></Center>: <InscriptionImage stats={true} root={mint} sx={{ minHeight: '200px'}}/>
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
                          minHeight: '200px',
                          aspectRatio: "1/1",
                          borderRadius: 8,
                        }}
                      />
                    </>
                  )}
                  <HStack>
                    <Text>Inscription Data</Text>
                    {inscriptionData && <CopyPublicKeyButton
                      publicKey={inscriptionData.pubkey?.toBase58()}
                    />}
                    
                  </HStack>
                  <Text color="white">{urlPrefix}</Text>
                </VStack>
              </SimpleGrid>
            </Center>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
};
