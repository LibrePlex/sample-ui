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
  IconButton,
} from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useContext, useEffect, useMemo } from "react";
import { TbRefresh } from "react-icons/tb";
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
  const { data, refetch } = useFetchSingleAccount(
    inscriptionSummaryId,
    connection
  );

  const inscriptionSummary = useMemo(() => {
    console.log({ pubkey: data?.pubkey.toBase58() });
    return data?.item
      ? decodeInscriptionSummary(program)(data.item.buffer, data.pubkey)
      : undefined;
  }, [program, data]);

  useEffect(() => {
    console.log({ inscriptionSummary });
  }, [inscriptionSummary]);

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
