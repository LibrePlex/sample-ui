import {
  Box,
  VStack,
  Text,
  Table,
  Tr,
  Th,
  Td,
  Center,
  BoxProps,
  Tbody,
} from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useContext, useMemo } from "react";
import {
  CopyPublicKeyButton,
  decodeInscriptionSummary,
  getInscriptionSummaryPda,
} from "shared-ui/src";
import { InscriptionsProgramContext } from "shared-ui/src/sdk/query/inscriptions/InscriptionsProgramContext";
import { useFetchSingleAccount } from "shared-ui/src/sdk/query/singleAccountInfo";

export const InscriptionsSummary = (rest: BoxProps) => {
  const inscriptionSummaryId = useMemo(() => getInscriptionSummaryPda()[0], []);

  const program = useContext(InscriptionsProgramContext);

  const { connection } = useConnection();
  const { data } = useFetchSingleAccount(inscriptionSummaryId, connection);

  const inscriptionSummary = useMemo(() => {
    console.log({ pubkey: data?.pubkey.toBase58() });
    return data?.item
      ? decodeInscriptionSummary(program)(data.item.buffer, data.pubkey)
      : undefined;
  }, [program, data]);

  return (
    <Box {...rest}>
      {inscriptionSummary?.item ? (
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
      ) : (
        <></>
      )}
    </Box>
  );
};
