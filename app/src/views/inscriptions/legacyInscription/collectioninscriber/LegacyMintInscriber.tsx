import { Paginator, usePaginator } from "@app/components/Paginator";
import {
  Center,
  Table,
  Tbody,
  Text,
  Th,
  Tr,
  VStack
} from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { MintMigratorRow } from "./MintMigratorRow";

export const LegacyMintInscriber = ({
  mintIds,
}: {
  mintIds: PublicKey[];
}) => {
  const { currentPage, setCurrentPage, maxPages, currentPageItems } =
    usePaginator(mintIds, 10);

  return (
    <VStack rowGap={2} mt={2}>
      <Paginator
        onPageChange={setCurrentPage}
        pageCount={maxPages}
        currentPage={currentPage}
      />
      {currentPageItems.length > 0 && (
        <Table>
          <Tbody>
            <Tr>
              <Th>
                <Text color="#aaa">MINT ID</Text>
              </Th>
              <Th color="#aaa">Name</Th>
              <Th color="#aaa">
                <Center>Off-chain image</Center>
              </Th>
              <Th color="#aaa">
                <Center>Inscription</Center>
              </Th>
              <Th color="#aaa">
                <Center>Explore</Center>
              </Th>
              <Th color="#aaa">
                <Center>Trade</Center>
              </Th>
              <Th></Th>
            </Tr>
            {currentPageItems.map((m, i) => (
              <MintMigratorRow mint={m} key={i} />
            ))}
          </Tbody>
        </Table>
      )}
    </VStack>
  );
};
