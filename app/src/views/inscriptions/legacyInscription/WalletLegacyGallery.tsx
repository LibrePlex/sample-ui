import {
  Button,
  HStack,
  Heading,
  Text,
  VStack,
  useMediaQuery,
} from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import { Paginator } from "@app/components/Paginator";
import {
  MintWithTokenAccount,
  getInscriptionPda,
  useLegacyMintsByWallet,
} from "@libreplex/shared-ui";
import { ReactNode, useMemo, useState } from "react";

import { useMultipleAccountsById } from "shared-ui/src/sdk/query/metadata/useMultipleAccountsById";
import { InscriptionFilter, MintCardLegacy } from "./MintCardLegacy";
import { DisappearingBox } from "@app/components/DisappearingBox";

export const WalletLegacyGallery = ({
  publicKey,
  actions,
}: {
  publicKey: PublicKey;
  actions: (item: MintWithTokenAccount) => ReactNode;
}) => {
  const { connection } = useConnection();

  const { data } = useLegacyMintsByWallet(publicKey, connection);

  const orderedData = useMemo(
    () =>
      [...data].sort((a, b) =>
        a.mint.toBase58().localeCompare(b.mint.toBase58())
      ),
    [data]
  );

  const ITEMS_PER_PAGE = 25;

  const [currentPage, setCurrentPage] = useState<number>(0);

  const [inscriptionFilter, setInscriptionFilter] = useState<InscriptionFilter>(
    InscriptionFilter.Both
  );

  const inscriptionIds = useMemo(
    () => data.map((item) => getInscriptionPda(item.mint)[0]),
    [data]
  );

  const { data: inscriptions } = useMultipleAccountsById(
    inscriptionIds,
    connection
  );

  const inscriptionsSet = useMemo(
    () =>
      new Set(
        inscriptions
          .filter((item) => item.data)
          .map((item) => item.accountId.toBase58())
      ),
    [inscriptions]
  );

  const filteredItems = useMemo(
    () =>
      orderedData.filter((item) => {
        const hasInscription = inscriptionsSet.has(
          getInscriptionPda(item.mint)[0].toBase58()
        );
        return (
          inscriptionFilter === InscriptionFilter.Both ||
          (inscriptionFilter === InscriptionFilter.With && hasInscription) ||
          (inscriptionFilter == InscriptionFilter.Without && !hasInscription)
        );
      }),
    [orderedData, inscriptionsSet, inscriptionFilter]
  );

  const maxPages = useMemo(
    () => Math.ceil(filteredItems.length / ITEMS_PER_PAGE),
    [filteredItems.length]
  );

  const [isSmallerThan800] = useMediaQuery("(max-width: 800px)");

  return (
    <VStack
      gap={4}
      alignItems="flex-start"
      justifyContent="center"
      width={"100%"}
    >
      <HStack
        mt={2}
        display="flex"
        flexDirection={isSmallerThan800 ? "column" : "row"}
        justifyContent={"center"}
        columnGap={2}
        w={[300, 300, 800]}
      >
        <Text>Inscriptions: </Text>
        <Button
          colorScheme="teal"
          variant={
            inscriptionFilter === InscriptionFilter.With ? "solid" : "outline"
          }
          onClick={() => {
            setInscriptionFilter(InscriptionFilter.With);
          }}
        >
          With
        </Button>
        <Button
          colorScheme="teal"
          variant={
            inscriptionFilter === InscriptionFilter.Without
              ? "solid"
              : "outline"
          }
          onClick={() => {
            setInscriptionFilter(InscriptionFilter.Without);
          }}
        >
          Without
        </Button>
        <Button
          colorScheme="teal"
          variant={
            inscriptionFilter === InscriptionFilter.Both ? "solid" : "outline"
          }
          onClick={() => {
            setInscriptionFilter(InscriptionFilter.Both);
          }}
        >
          Both
        </Button>
      </HStack>
      <Heading size={"md"}>Showing {filteredItems.length} items</Heading>
      <Paginator
        onPageChange={setCurrentPage}
        pageCount={maxPages}
        currentPage={currentPage}
      />

      <HStack
        gap={8}
        alignItems="flex-start"
        justifyContent="center"
        flexWrap="wrap"
      >
        {filteredItems
          .slice(
            currentPage * ITEMS_PER_PAGE,
            (currentPage + 1) * ITEMS_PER_PAGE
          )
          .map((item, idx) => (
            <DisappearingBox key={idx}>
              <MintCardLegacy mintId={item.mint}>
                {actions ? actions(item) : <></>}
              </MintCardLegacy>
            </DisappearingBox>
          ))}
      </HStack>
    </VStack>
  );
};
