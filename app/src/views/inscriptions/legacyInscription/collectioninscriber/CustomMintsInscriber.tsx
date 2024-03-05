import { Paginator, usePaginator } from "@app/components/Paginator";
import {
  Box,
  Button,
  Center,
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
import { AccountInfo, PublicKey } from "@solana/web3.js";
import { useCallback, useMemo, useState } from "react";

import { MintMigratorRow } from "./MintMigratorRow";
import { MyMintsInscriber } from "./MyMintsInscriber";
import { LegacyMintInscriber } from "./LegacyMintInscriber";
import React from "react";
import { useQuery } from "react-query";

enum View {
  WithInscriptions,
  WithoutInscriptions,
  All,
}

export const CustomMintsInscriber = () => {
  const [mintIds, setMintIds] = useState<PublicKey[]>([]);
  const [errors, setErrors] = useState<{ i: string; e: string }[]>([]);
  const [inputTxt, setInputTxt] = useState<string>("[]");

  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { data, refetch, isFetching } = useTokenAccountsByOwner(
    publicKey,
    connection,
    TOKEN_PROGRAM_ID
  );

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
        inscription: getInscriptionPda(item)[0]!,
      })),
    [mintIds]
  );

  const { data: inscriptionAccounts } = useQuery<{
    items: { account: AccountInfo<Buffer> | null; id: PublicKey }[];
  }>(
    "key",
    async () => {
      return {
        items: await connection
          .getMultipleAccountsInfo(
            inscriptionIds.map((item) => item.inscription)
          )
          .then((value) => {
            return value
              .map((item, idx) => ({
                account: item,
                id: inscriptionIds[idx].inscription,
              }))
              .filter((item) => item.account?.data);
          }),
      };
    },
    {
      refetchOnMount: false,
      refetchInterval: 1000,
    }
  );

  const inscriptionDict = useMemo(
    () =>
      new Set<string>(
        ...(inscriptionAccounts?.items.map((item) => item.id.toBase58()) ?? []),
      ),
    [inscriptionAccounts]
  );

  const mintsWithInscriptions = useMemo(
    () =>
      new Set(
        inscriptionIds
          .filter(
            (item) =>
              item?.inscription &&
              inscriptionDict.has(item?.inscription?.toBase58())
          )
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
      <Box
        className="border-2 rounded-xl border-inherit"
        m={1}
        p={4}
        maxW={"300px"}
      >
        <Text fontSize="2xl">
          Hit the button below to check your wallet or else paste your hashlist
          into the text box.
        </Text>
      </Box>
      <VStack>
        {mintIds.length === 0 && selectedInputCount > 0 && (
          <Button onClick={() => processInput()}>
            Fetch mints ({selectedInputCount})
          </Button>
        )}
        {mintIds.length > 0 && (
          <Button onClick={() => setMintIds([])}>Re-enter mints</Button>
        )}
      </VStack>

      {errors.length > 0 && (
        <Table>
          <Tbody>
            {errors.map((e, idx) => (
              <Tr key={idx}>
                <Td>
                  <CopyPublicKeyButton publicKey={e.i} />
                </Td>
                <Td color="#f33">{e.e}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
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

      <LegacyMintInscriber mintIds={filteredMintIds} />
    </VStack>
  );
};
