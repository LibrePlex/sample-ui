import { HStack, Heading, VStack } from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import { Paginator } from "@app/components/Paginator";
import {
  IRpcObject,
  Inscription,
  LegacyMint,
  LibrePlexLegacyInscriptionsProgramContext,
  decodeInscription,
  getInscriptionPda,
  useLegacyMintsByWallet,
} from "@libreplex/shared-ui";
import { ReactNode, useContext, useMemo, useState } from "react";
import { MintCardLegacy } from "./MintCardLegacy";
import { useMultipleAccountsById } from "shared-ui/src/sdk/query/metadata/useMultipleAccountsById";
import { InscriptionsProgramContext } from "shared-ui/src/sdk/query/inscriptions/InscriptionsProgramContext";

export const WalletLegacyGallery = ({
  publicKey,
  actions,
}: {
  publicKey: PublicKey;
  actions: (item: LegacyMint) => ReactNode;
}) => {
  const { connection } = useConnection();

  const { data } = useLegacyMintsByWallet(publicKey, connection);

  const { program: legacyProgram } = useContext(
    LibrePlexLegacyInscriptionsProgramContext
  );
  const inscriptionsProgram = useContext(InscriptionsProgramContext);
  const orderedData = useMemo(
    () =>
      [...data].sort((a, b) =>
        a.mint.toBase58().localeCompare(b.mint.toBase58())
      ),
    [data]
  );

  const ITEMS_PER_PAGE = 25;

  const maxPages = useMemo(
    () => Math.ceil(data.length / ITEMS_PER_PAGE),
    [data.length]
  );
  const [currentPage, setCurrentPage] = useState<number>(0);

  // see if any of the mints have inscriptions

  const inscriptionIds = useMemo(
    () =>
      orderedData.map(
        (item) => getInscriptionPda(inscriptionsProgram.programId, item.mint)[0]
      ),
    [orderedData, inscriptionsProgram]
  );

  const { data: inscriptionAccounts } = useMultipleAccountsById(
    inscriptionIds,
    connection
  );

  const inscriptionsByRoot = useMemo(() => {
    const _inscriptionsByRoot: { [mintId: string]: IRpcObject<Inscription> } =
      {};

    for (const inscriptionAccount of inscriptionAccounts) {
      if (inscriptionAccount.data) {
        const inscription = decodeInscription(inscriptionsProgram)(
          Buffer.from(inscriptionAccount.data),
          inscriptionAccount.accountId
        );
        if (inscription) {
          _inscriptionsByRoot[inscription.item.root.toBase58()] = inscription;
        }
      }
    }
    return _inscriptionsByRoot;
  }, [inscriptionAccounts, inscriptionsProgram]);

  return (
    <VStack
      gap={16}
      alignItems="flex-start"
      justifyContent="center"
      style={{ marginTop: 64 }}
      width={"100%"}
    >
      <Heading size={"md"}>Showing {orderedData.length} items</Heading>
      <Paginator
        onPageChange={setCurrentPage}
        pageCount={maxPages}
        currentPage={currentPage}
      />
      <HStack
        gap={8}
        alignItems="flex-start"
        justifyContent="flex-start"
        flexWrap="wrap"
      >
        {orderedData
          .slice(
            currentPage * ITEMS_PER_PAGE,
            (currentPage + 1) * ITEMS_PER_PAGE
          )
          .map((item, idx) => (
            <MintCardLegacy mint={item} key={idx}>
              {actions ? actions(item) : <></>}
            </MintCardLegacy>
          ))}
      </HStack>
    </VStack>
  );
};
