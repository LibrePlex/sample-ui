import {
  Box,
  BoxProps,
  Center,
  IconButton,
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
  getInscriptionRankPda
} from "@libreplex/shared-ui";
import { useConnection } from "@solana/wallet-adapter-react";
import { useCallback, useMemo } from "react";
import { TbRefresh } from "react-icons/tb";
import { useFetchSingleAccount } from "shared-ui/src/sdk/query/singleAccountInfo";
import { useInscriptionSummary } from "./useInscriptionsSummary";

export const InscriptionsSummary = (rest: BoxProps) => {
  const { data: inscriptionSummary, refetch: refetchSummary } =
    useInscriptionSummary();
  const inscriptionPageId = useMemo(
    () => getInscriptionRankPda(BigInt(0))[0],
    []
  ); // for now consider the first inscription page only

  const { connection } = useConnection();
  const { data, refetch: refetchInscriptionPage } = useFetchSingleAccount(
    inscriptionPageId,
    connection
  );

  const refetch = useCallback(() => {
    refetchSummary();
    refetchInscriptionPage();
  }, [refetchSummary, refetchInscriptionPage]);
  return (
    <Box {...rest}>
      <Box sx={{ position: "relative" }}>
        {inscriptionSummary?.item ? (
          <>
            <IconButton
              style={{ position: "absolute", bottom: "26px", right: "12px" }}
              size="xs"
              onClick={() => refetch()}
              aria-label={"Refresh"}
            >
              <TbRefresh />
            </IconButton>
            <VStack>
              <Table style={{ border: "1px solid #aaa" }} m={3}>
                <Tbody>
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
