import { useConnection } from "@solana/wallet-adapter-react";
import { useMemo, useState } from "react";
import { getInscriptionRankPda } from "@libreplex/shared-ui";
import { decodeInscriptionRankPage } from "@libreplex/shared-ui";
import { useFetchSingleAccount } from "@libreplex/shared-ui";
import { HStack, Heading, VStack } from "@chakra-ui/react";
import { InscriptionCardLegacy } from "./InscriptionCardLegacy";
import { Paginator } from "@app/components/Paginator";

export const InscriptionGallery = () => {
  const inscriptionPageId = useMemo(
    () => getInscriptionRankPda(BigInt(0))[0],
    []
  ); // for now consider the first inscription page only

  const { connection } = useConnection();
  const inscriptionPageAccount = useFetchSingleAccount(
    inscriptionPageId,
    connection
  );

  const ITEMS_PER_PAGE = 25;

  const { item, pubkey } = useMemo(
    () =>
      inscriptionPageAccount?.data
        ? decodeInscriptionRankPage(
            inscriptionPageAccount?.data?.item?.buffer,
            inscriptionPageAccount.data.pubkey,
            0,
            25
          )
        : { item: null, pubkey: inscriptionPageId },
    [inscriptionPageAccount.data, inscriptionPageId]
  );

  const maxPages = useMemo(
    () => Math.ceil((item?.inscriptionKeys.length ?? 0)/ ITEMS_PER_PAGE),
    [item?.inscriptionKeys.length]
  );

  const [currentPage, setCurrentPage] = useState<number>(0);

  return (
    <VStack>
      <Heading pt={3} size={"md"}>Showing {item?.inscriptionKeys.length} items</Heading>
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
        {item?.inscriptionKeys?.slice(
            currentPage * ITEMS_PER_PAGE,
            (currentPage + 1) * ITEMS_PER_PAGE
          ).map((item, idx) => (
          <InscriptionCardLegacy inscriptionId={item} key={idx} />
        ))}
      </HStack>
    </VStack>
  );
};
