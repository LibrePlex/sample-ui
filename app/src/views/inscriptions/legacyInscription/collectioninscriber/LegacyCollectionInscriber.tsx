import { Paginator, usePaginator } from "@app/components/Paginator";
import {
  Button,
  Center,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Tr,
  VStack,
} from "@chakra-ui/react";
import {
  CopyPublicKeyButton,
  getInscriptionPda,
  notify,
  useTokenAccountsByOwner,
} from "@libreplex/shared-ui";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useMemo, useState } from "react";
import { useMultipleAccountsById } from "shared-ui/src/sdk/query/metadata/useMultipleAccountsById";
import { MintMigratorRow } from "./MintMigratorRow";
import { CreateRankPageTransactionButton } from "@app/components/legacyInscriptions/CreateRankPageTransactionButton";

export const LegacyCollectionInscriber = () => {
  const [mintIds, setMintIds] = useState<PublicKey[]>([]);
  const [errors, setErrors] = useState<{ i: string; e: string }[]>([]);
  const [inputTxt, setInputTxt] = useState<string>(
    '["6LWDWUAMVXD1r66SvaEibpR1dq1bhRM1v724qmGeoAiD"]'
  );

  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { data, refetch, isFetching } = useTokenAccountsByOwner(
    publicKey,
    connection,
    TOKEN_PROGRAM_ID
  );

  enum View {
    WithInscriptions,
    WithoutInscriptions,
    All,
  }
  const fetchMintsFromWallet = () => {
    setInputTxt(JSON.stringify(data.map((item) => item.item.mint)));
  };

  const processInput = useCallback(() => {
    const _errors: { i: string; e: string }[] = [];
    const _mintIds = new Set<string>();
    try {
      const inputJson = JSON.parse(inputTxt);
      setInputTxt(JSON.stringify(inputJson, undefined, 4));
      for (const i of inputJson) {
        try {
          _mintIds.add(new PublicKey(i).toBase58());
        } catch (e) {
          _errors.push({ i, e: (e as Error).message });
        }
      }
    } catch (e) {
      notify({
        type: "error",
        message:
          "Could not parse hashlist. Please check the format and try again",
      });
    }
    setErrors(_errors);
    setMintIds(
      [..._mintIds]
        .sort((a, b) => a.localeCompare(b))
        .map((item) => new PublicKey(item))
    );
  }, [inputTxt]);

  const selectedInputCount = useMemo(() => {
    try {
      return JSON.parse(inputTxt).length;
    } catch (e) {
      return 0;
    }
  }, [inputTxt]);

  const inscriptionIds = useMemo(
    () =>
      mintIds.map((item) => ({
        mint: item,
        inscription: getInscriptionPda(item)[0],
      })),
    [mintIds]
  );

  const inscriptionAccounts = useMultipleAccountsById(
    inscriptionIds.map((item) => item.inscription),
    connection
  );

  const inscriptionDict = useMemo(
    () =>
      new Set<string>([
        ...inscriptionAccounts.data
          .filter((item) => item.data)
          .map((item) => item.accountId.toBase58()),
      ]),
    [inscriptionAccounts]
  );

  const mintsWithInscriptions = useMemo(
    () =>
      new Set(
        inscriptionIds
          .filter((item) => inscriptionDict.has(item.inscription.toBase58()))
          .map((item) => item.mint.toBase58())
      ),
    [inscriptionDict, inscriptionIds]
  );

  const [view, setView] = useState<View>(View.All);

  const filteredMintIds = useMemo(
    () =>
      mintIds.filter(
        (item) =>
          view === View.All ||
          (view === View.WithInscriptions &&
            mintsWithInscriptions.has(item.toBase58())) ||
          (view === View.WithoutInscriptions &&
            !mintsWithInscriptions.has(item.toBase58()))
      ),
    [mintIds, view, mintsWithInscriptions]
  );

  const { currentPage, setCurrentPage, maxPages, currentPageItems } =
    usePaginator(filteredMintIds);

  return (
    <VStack rowGap={2} mt={2}>
      {/* <CreateRankPageTransactionButton params={{
        pageIndex: 1
      }} formatting={{}} /> */}
      {mintIds.length === 0 && (
        <>
          <Text>Your wallet: {data?.length} mints</Text>
          <Button
            onClick={() => {
              fetchMintsFromWallet();
            }}
          >
            Set wallet contents
          </Button>
        </>
      )}
      <VStack>
        {mintIds.length === 0 ? (
          <Button onClick={() => processInput()}>
            Fetch mints ({selectedInputCount})
          </Button>
        ) : (
          <>
            <Button onClick={() => setMintIds([])}>Re-enter mints</Button>
            {/* <InputGroup>
              <InputRightElement pointerEvents="none">
                <HiOutlineSearch color="gray.300" />
              </InputRightElement>
              <Input placeholder="Search by mintId" />
            </InputGroup> */}
          </>
        )}
      </VStack>
      {mintIds.length > 0 && (
        <HStack
          sx={{
            display: "flex",
          }}
          gap={1}
        >
          <Button
            colorScheme="teal"
            variant={view === View.All ? "solid" : "outline"}
            onClick={() => {
              setView(View.All);
            }}
          >
            All
          </Button>
          <Button
            colorScheme="teal"
            variant={view === View.WithInscriptions ? "solid" : "outline"}
            onClick={() => {
              setView(View.WithInscriptions);
            }}
          >
            With Inscriptions
          </Button>
          <Button
            colorScheme="teal"
            variant={view === View.WithoutInscriptions ? "solid" : "outline"}
            onClick={() => {
              setView(View.WithoutInscriptions);
            }}
          >
            Without Inscriptions
          </Button>
        </HStack>
      )}

      {mintIds.length === 0 && (
        <Textarea
          size="md"
          cols={40}
          rows={20}
          placeholder="Paste the hashlist of the mint ids you would like to inscribe in standard ME hashlist/json format (starting with [ and ending with ]). Don't worry about duplicates as these will be ignored."
          value={inputTxt}
          onChange={(e) => {
            setInputTxt(e.currentTarget.value);
          }}
        />
      )}

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
                <Text color="#aaa">
                  Displayed items: {filteredMintIds.length}
                </Text>
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
              <Th></Th>
            </Tr>
            {currentPageItems.map((m, i) => (
              <MintMigratorRow mint={m} key={i} />
            ))}
            {errors.map((e, idx) => (
              <Tr key={idx}>
                <Td>
                  <CopyPublicKeyButton publicKey={e.i} />
                </Td>
                <Td>{e.e}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </VStack>
  );
};
