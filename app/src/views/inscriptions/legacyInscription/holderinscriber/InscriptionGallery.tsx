import { useConnection } from "@solana/wallet-adapter-react";
import { useMemo, useState } from "react";
import { getInscriptionRankPda } from "@libreplex/shared-ui";
import { decodeInscriptionRankPage } from "@libreplex/shared-ui";
import { useFetchSingleAccount } from "@libreplex/shared-ui";
import { Button, HStack, Heading, VStack } from "@chakra-ui/react";
import { InscriptionCardLegacy } from "../InscriptionCardLegacy";
import { Paginator } from "@app/components/Paginator";

export const InscriptionGallery = () => {
  const inscriptionPageId = useMemo(
    () => getInscriptionRankPda(BigInt(0))[0],
    []
  ); // for now consider the first inscription page only

  const { connection } = useConnection();
  const { data, refetch } = useFetchSingleAccount(
    inscriptionPageId,
    connection
  );

  const ITEMS_PER_PAGE = 25;
  const [currentPage, setCurrentPage] = useState<number>(0);

  const { item, pubkey } = useMemo(
    () =>
      data
        ? decodeInscriptionRankPage(
            data?.item?.buffer,
            data.pubkey,
            currentPage * ITEMS_PER_PAGE,
            (currentPage + 1) * ITEMS_PER_PAGE
          )
        : { item: null, pubkey: inscriptionPageId },
    [currentPage, data, inscriptionPageId]
  );

  const maxPages = useMemo(
    () => {
      // console.log({l: data?.item?.buffer.length, m: Math.ceil((data?.item?.buffer.length - 12 ) / 32 / ITEMS_PER_PAGE)});
      return Math.ceil((data?.item?.buffer.length - 12 ) / 32 / ITEMS_PER_PAGE)
    },
    [data?.item?.buffer.length]
  );

  

  return (
    <VStack>
      <Heading pt={3} size={"md"}>
        Showing {item?.inscriptionKeys.length} items
      </Heading>
      <Paginator
        onPageChange={setCurrentPage}
        pageCount={maxPages}
        currentPage={currentPage}
      />
      <Button onClick={() => refetch()}>Refresh</Button>
      <HStack
        gap={8}
        alignItems="flex-start"
        justifyContent="center"
        flexWrap="wrap"
      >
        {item?.inscriptionKeys.map((item, idx) => (
          <InscriptionCardLegacy inscriptionId={item} key={idx} />
        ))}
      </HStack>
    </VStack>
  );
};
