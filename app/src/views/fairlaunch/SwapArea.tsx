import {
  Button,
  Center,
  Flex,
  Heading,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  VStack,
  Box,
  Text,
} from "@chakra-ui/react";
import { Metadata as LegacyMetadata } from "@metaplex-foundation/mpl-token-metadata";
import {
  Deployment,
  IRpcObject,
  decodeLegacyMetadata,
  getHashlistPda,
  getLegacyMetadataPda,
  getProgramInstanceMetadata,
  useHashlistById,
  useLegacyMintsByWallet,
  useMint,
  useTokenAccountsByOwner,
} from "@libreplex/shared-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { MintTransactionButton } from "./MintTransactionButton";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useMultipleAccountsById } from "shared-ui/src/sdk/query/metadata/useMultipleAccountsById";
import { DeploymentMintDisplay } from "./DeploymentMintDisplay";
import { Paginator, usePaginator } from "@app/components/Paginator";
import { de } from "date-fns/locale";
import { InfoIcon } from "@chakra-ui/icons";

export const SwapArea = ({
  deployment,
}: {
  deployment: IRpcObject<Deployment>;
}) => {
  const fungibleMintId = useMemo(
    () => deployment?.item?.fungibleMint,
    [deployment]
  );

  const { connection } = useConnection();

  const fungibleMint = useMint(fungibleMintId, connection);

  const { data } = useLegacyMintsByWallet(deployment.pubkey, connection);

  const hashlistId = useMemo(
    () => (deployment ? getHashlistPda(deployment?.pubkey)[0] : undefined),
    [deployment]
  );

  const { data: hashlist } = useHashlistById(hashlistId, connection);

  const hashlistIndex = useMemo(() => {
    const _hashlistIndex: { [key: string]: number } = {};
    for (const hashlistEntry of hashlist?.item?.issues ?? []) {
      _hashlistIndex[hashlistEntry.mint.toBase58()] = Number(
        hashlistEntry.order
      );
    }
    return _hashlistIndex;
  }, [hashlist]);

  const mintsFromThisDeployer = useMemo(
    () =>
      data.filter((item) => hashlistIndex[item.mint.toBase58()] !== undefined),
    [data, hashlistIndex]
  );

  const { setCurrentPage, maxPages, currentPage, currentPageItems } =
    usePaginator(mintsFromThisDeployer, 10);

  const totalSplBalance = useMemo(
    () =>
      data
        .filter(
          (item) =>
            item?.mint.toBase58() === deployment?.item?.fungibleMint.toBase58()
        )
        .reduce((a, b) => a + Number(b.tokenAccount.item.amount ?? 0), 0),
    [data, deployment?.item?.fungibleMint]
  );

  const denominator = useMemo(
    () => 10 ** deployment.item.decimals,
    [deployment.item.decimals]
  );

  return (
    <VStack>
      <Heading size="md">Escrow Contents</Heading>
      <Paginator
        onPageChange={setCurrentPage}
        pageCount={maxPages}
        currentPage={currentPage}
      />
      <Table>
        <Thead>
          <Th colSpan={3}>
            <Center>NFT</Center>
          </Th>
          <Th colSpan={1}>
            {" "}
            <Center>SPL</Center>
          </Th>
          <Td colSpan={2}>
            <Popover size="md">
              <PopoverTrigger>
                <Button colorScheme="white" variant="outline">
                  <InfoIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader>
                  <Flex justify="space-between" align="center" p={2}>
                    <Box>
                      <Text as="b">SPL Token Balance</Text>
                    </Box>
                  </Flex>
                </PopoverHeader>
                <Box p={5}>
                  <Center>
                    <VStack align={"start"}>
                      <Text>
                        The escrow always holds exactly the correct amount of
                        SPL token to allow all NFTs in circulation to be
                        converted.
                      </Text>

                      <Text>
                        For pre-Fair Launch deployments, escrow balance can be
                        lower than the amount of NFTs in circulation. However,
                        once all NFTs are migrated from pre-Fair Launch
                        validators, the balances will match exactly.
                      </Text>
                    </VStack>
                  </Center>
                </Box>
              </PopoverContent>
            </Popover>
          </Td>
        </Thead>
        <Thead>
          <Th>Escrow</Th>
          <Th>Circulation</Th>
          <Th>Total</Th>
          <Th>Escrow</Th>
          <Th>Circulation</Th>
          <Th>Total</Th>
        </Thead>
        <Tbody>
          <Td>
            {Number(
              deployment?.item?.escrowNonFungibleCount ?? 0
            ).toLocaleString()}{" "}
            x {Number(deployment?.item?.limitPerMint ?? 0).toLocaleString()}
          </Td>
          <Td>
            {(
              Number(deployment?.item?.numberOfTokensIssued ?? 0) -
              Number(deployment?.item?.escrowNonFungibleCount ?? 0)
            ).toLocaleString()}{" "}
            x {Number(deployment?.item?.limitPerMint ?? 0).toLocaleString()}
          </Td>
          <Td>
            {Number(
              deployment?.item?.numberOfTokensIssued ?? 0
            ).toLocaleString()}{" "}
            x {Number(deployment?.item?.limitPerMint ?? 0).toLocaleString()}
          </Td>
          <Td>
            {(Number(totalSplBalance ?? 0) / denominator).toLocaleString()}
          </Td>
          <Td>
            {(
              (Number(fungibleMint?.item?.supply ?? 0) -
                Number(totalSplBalance ?? 0)) /
              denominator
            ).toLocaleString()}
          </Td>
          <Td>
            {(
              Number(fungibleMint?.item?.supply ?? 0) / denominator
            ).toLocaleString()}
          </Td>
        </Tbody>
      </Table>
      {deployment.item.migratedFromLegacy ? (
        <Text>Hashlist closed - cannot mint more tokens</Text>
      ) : (
        <MintTransactionButton
          params={{
            deployment,
          }}
          formatting={{}}
        />
      )}
      {/* <Heading size="md">
        {mintsFromThisDeployer.length} NFTs + {totalSplBalance / denominator}{" "}
        SPL tokens{" "}
      </Heading> */}
      <DeploymentMintDisplay mints={currentPageItems} deployment={deployment} />
    </VStack>
  );
};
