import {
  Button,
  Center,
  HStack,
  IconButton,
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
  VStack,
} from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { useContext, useMemo } from "react";
import { TbRefresh } from "react-icons/tb";

import { HiCheckCircle, HiXCircle } from "react-icons/hi";

import {
  SolscanLink,
  useInscriptionDataForMint,
  useInscriptionForMint,
} from "../..";
import { useValidationHash } from "./useValidationHash";
import { ClusterContext } from "../../contexts/NetworkConfigurationProvider";
import React from "react";

export const InscriptionTable = ({ mint }: { mint: PublicKey }) => {
  const {
    data: inscription,
    isFetching: isFetchingInscription,
    refetch: refreshInscription,
  } = useInscriptionForMint(mint);
  const {
    data: inscriptionData,
    isFetching: isFetchingInscriptionData,
    refetch: refreshInscriptionData,
  } = useInscriptionDataForMint(mint);

  const hashOfInscription = useValidationHash(inscriptionData?.item?.buffer);

  const base64ImageInscription = useMemo(
    () => Buffer.from(inscriptionData?.item.buffer ?? []).toString("base64"),
    [inscriptionData?.item?.buffer]
  );

  const { cluster } = useContext(ClusterContext);

  return (
    <Table>
      <Tbody>
        <Tr>
          <Th>
            <Text color="#aaa">Rent (SOL)</Text>
          </Th>
          <Td>
            <Text>
              {(
                (inscriptionData?.item
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
            <Text>{inscription?.item.size}</Text>
          </Td>
        </Tr>

        <Tr>
          <Th>
            <VStack>
              <Text color="#aaa">Inscribed image</Text>
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
                    style={{
                      minWidth: "240px",
                      maxWidth: "240px",
                      aspectRatio: "1/1",
                      borderRadius: 8,
                    }}
                    src={`data:image/webp;base64,${base64ImageInscription}`}
                  />
                ) : (
                  <Skeleton
                    style={{
                      minWidth: "240px",
                      maxWidth: "240px",
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
                      aria-label="refresh onchain data"
                      size="sm"
                      onClick={() => refreshInscriptionData()}
                    >
                      <TbRefresh />
                    </IconButton>
                  )}
                </HStack>
              </VStack>
            </Center>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
};
