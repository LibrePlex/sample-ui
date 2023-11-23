import {
  Box,
  BoxProps,
  Center,
  IconButton,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
  VStack,
} from "@chakra-ui/react";
import {
  CopyPublicKeyButton,
  getInscriptionRankPda,
  useInscriptionById,
  useOffChainMetadataCache,
} from "@libreplex/shared-ui";
import { useConnection } from "@solana/wallet-adapter-react";
import React, { useEffect, useMemo } from "react";
import { TbRefresh } from "react-icons/tb";
import { Image } from "@chakra-ui/react";
import { useInscriptionSummary } from "./useInscriptionsSummary";

export const InscriptionsSummary = (rest: BoxProps) => {
  const { data: inscriptionSummary, refetch: refetchSummary } =
    useInscriptionSummary(7500);

  

  const { connection } = useConnection();
  const { data: lastInscription } = useInscriptionById(
    inscriptionSummary?.item?.lastInscription,
    connection
  );

  const metadata = useOffChainMetadataCache(lastInscription?.item.root);

  return (
    <Box {...rest}>
      <Box sx={{ position: "relative" }}>
        {inscriptionSummary?.item ? (
          <>
            <IconButton
              style={{ position: "absolute", bottom: "26px", right: "12px" }}
              size="xs"
              onClick={() => refetchSummary()}
              aria-label={"Refresh"}
            >
              <TbRefresh />
            </IconButton>
            <VStack>
              {metadata?.data?.images?.square ? (
                <Image
                  style={{ width: "400px", height: "400px" }}
                  alt="off-chain-image"
                  src={metadata?.data?.images?.square}
                />
              ) : (
                <Skeleton style={{ width: "400px", height: "400px" }} />
              )}
              <Table style={{ border: "1px solid #aaa" }} m={3}>
                <Tbody>
                <Tr>
                    <Th>
                      <Text color="#aaa">Name</Text>
                    </Th>
                    <Td>
                      {metadata?.data?.name}
                    </Td>
                  </Tr>
                  <Tr>
                    <Th>
                      <Text color="#aaa">Last inscriber</Text>
                    </Th>
                    <Td>
                      <CopyPublicKeyButton
                        publicKey={inscriptionSummary?.item?.lastInscriber.toBase58()}
                      />
                    </Td>
                  </Tr>

                  <Tr>
                    <Th>
                      <Text color="#aaa">Last mint</Text>
                    </Th>
                    <Td>
                      <CopyPublicKeyButton
                        publicKey={lastInscription?.item?.root.toBase58()}
                      />
                    </Td>
                  </Tr>

                  <Tr>
                    <Th>
                      <Text color="#aaa">Total inscriptions</Text>
                    </Th>
                    <Td>
                      <Center>
                        {inscriptionSummary?.item.inscriptionCountTotal
                          .toNumber()
                          .toLocaleString()}
                      </Center>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </VStack>
          </>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};
