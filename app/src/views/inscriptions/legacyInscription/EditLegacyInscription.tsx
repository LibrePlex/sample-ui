import { ResizeLegacyMetadataAsHolderTransactionButton } from "@app/components/legacyInscriptions/ResizeLegacyInscriptionAsHolderTransactionButton";
import { WriteToLegacyInscriptionAsHolderTransactionButton } from "@app/components/legacyInscriptions/WriteToLegacyInscriptionAsHolderTransactionButton";
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Skeleton,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
  IconButton,
  Center,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { TbRefresh } from "react-icons/tb";
import { PublicKey } from "@solana/web3.js";
import { useContext, useMemo } from "react";
import { useLegacyInscriptionForMint } from "./useLegacyInscriptionForMint";
import { useValidationHash } from "../useValidationHash";
import { HiCheckCircle, HiXCircle, HiSearch } from "react-icons/hi";
import { compress } from "marketplace/next.config";
import { ClusterContext } from "@shared-ui/contexts/NetworkConfigurationProvider";
import Link from "next/link";
import { SolscanLink, useInscriptionDataForMint, useInscriptionForMint, useLegacyCompressedImage } from "@libreplex/shared-ui";

export const EditLegacyInscription = ({ mint }: { mint: PublicKey }) => {
  const { data: inscription } = useInscriptionForMint(mint);
  const legacyInscription = useLegacyInscriptionForMint(mint);
  const {
    data: inscriptionData,
    refetch: refreshInscriptionData,
    isFetching: isFetchingInscriptionData,
  } = useInscriptionDataForMint(mint);

  const hashOfInscription = useValidationHash(inscriptionData?.item.buffer);

  const {
    data: compressedImage,
    refetch: refetchOffchainData,
    isFetching: isFetchingOffchainData,
  } = useLegacyCompressedImage(mint, false);

  const base64ImageOffChain = useMemo(
    () => Buffer.from(compressedImage?.buf ?? []).toString("base64"),
    [compressedImage]
  );

  const base64ImageInscription = useMemo(
    () => Buffer.from(inscriptionData?.item.buffer ?? []).toString("base64"),
    [inscriptionData?.item.buffer]
  );

  const hashOk = useMemo(
    () => hashOfInscription === compressedImage?.hash,
    [hashOfInscription, compressedImage]
  );
  const sizeOk = useMemo(
    () => compressedImage?.buf.length === inscription?.item.size,
    [compressedImage, inscription]
  );

  const { cluster } = useContext(ClusterContext);

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          colorScheme="teal"
          size="xs"
          onClick={async () => {
            await refetchOffchainData();
            await refreshInscriptionData();
          }}
        >
          Edit
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>Edit Inscription</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <Table>
              <Tbody>
                <Tr>
                  <Th>
                    <Text color="#aaa">Rent (SOL)</Text>
                  </Th>
                  <Td>
                    <Text>
                      {(
                        (inscriptionData
                          ? Number(inscriptionData.item.balance.toString())
                          : 0) / Number(1_000_000_000)
                      ).toLocaleString()}
                    </Text>
                  </Td>
                </Tr>

                <Tr>
                  <Th>
                    <Text color="#aaa">Size (bytes)</Text>
                  </Th>
                  <Td>
                    <HStack>
                      <Text>{inscription?.item.size}</Text>
                      {sizeOk ? (
                        <>
                          <HiCheckCircle color="lightgreen" />
                        </>
                      ) : (
                        <>
                          {/* <Text>{inscription?.item.size} {"<"} {compressedImage?.buf.length}</Text> */}
                          <HiXCircle color="#f66" />
                        </>
                      )}
                      {compressedImage?.buf &&
                        compressedImage?.buf.length !==
                          inscription.item.size && (
                          <ResizeLegacyMetadataAsHolderTransactionButton
                            params={{
                              mint,
                              targetSize: compressedImage?.buf.length,
                              currentSize: inscription.item.size,
                            }}
                            formatting={{}}
                          />
                        )}
                    </HStack>
                  </Td>
                </Tr>
                <Tr>
                  <Th>
                    <Text color="#aaa">Offchain image</Text>
                  </Th>
                  <Td>
                    <Center columnGap={2}>
                      <VStack>
                        {base64ImageOffChain ? (
                          <img
                            alt="off chain image"
                            src={`data:image/webp;base64,${base64ImageOffChain}`}
                          />
                        ) : (
                          <Skeleton
                            style={{
                              minWidth: "135px",
                              maxWidth: "135px",
                              aspectRatio: "1/1",
                              borderRadius: 8,
                            }}
                          />
                        )}
                        <HStack columnGap={2}>
                          {isFetchingOffchainData ? (
                            <Spinner />
                          ) : (
                            <IconButton
                              aria-label="refresh offchain metadata"
                              size="sm"
                              onClick={() => refetchOffchainData()}
                            >
                              <TbRefresh />
                            </IconButton>
                          )}

                          <Text>
                            {compressedImage?.hash.slice(0, 3)}...{}
                            {compressedImage?.hash.slice(-3)}
                          </Text>
                        </HStack>
                      </VStack>
                    </Center>
                  </Td>
                </Tr>
                <Tr>
                  <Th>
                    <VStack>
                      <Text color="#aaa">Inscribed image</Text>
                      {compressedImage?.buf && sizeOk && !hashOk && (
                        <WriteToLegacyInscriptionAsHolderTransactionButton
                          params={{
                            mint,
                            dataBytes: [...compressedImage?.buf],
                          }}
                          formatting={{}}
                        />
                      )}
                      {inscriptionData && (
                        <SolscanLink
                          address={inscriptionData.pubkey.toBase58()}
                          cluster={cluster}
                        />
                      )}
                    </VStack>
                  </Th>
                  <Td>
                    <Center columnGap={2}>
                      <VStack>
                        {base64ImageInscription ? (
                          <img
                            src={`data:image/webp;base64,${base64ImageInscription}`}
                          />
                        ) : (
                          <Skeleton
                            style={{
                              minWidth: "135px",
                              maxWidth: "135px",
                              aspectRatio: "1/1",
                              borderRadius: 8,
                            }}
                          />
                        )}
                        <HStack columnGap={2}>
                          {isFetchingInscriptionData ? (
                            <Spinner />
                          ) : (
                            <IconButton
                              aria-label="refresh offchain metadata"
                              size="sm"
                              onClick={() => refreshInscriptionData()}
                            >
                              <TbRefresh />
                            </IconButton>
                          )}

                          <Text>
                            {hashOfInscription?.slice(0, 3)}...{}
                            {hashOfInscription?.slice(-3)}
                          </Text>
                          {hashOk ? (
                            <>
                              <HiCheckCircle color="lightgreen" />
                            </>
                          ) : (
                            <HiXCircle color="#f66" />
                          )}
                        </HStack>
                      </VStack>
                    </Center>
                  </Td>
                </Tr>
                <Tr>
                  <Th>
                    <Text color="#aaa">Created by</Text>
                  </Th>
                  <Td>
                    <Text>
                      {legacyInscription?.item.authorityType.holder
                        ? "Holder"
                        : "UAuth"}
                    </Text>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
