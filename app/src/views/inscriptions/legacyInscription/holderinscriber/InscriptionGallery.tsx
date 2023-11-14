import { useConnection } from "@solana/wallet-adapter-react";
import { useMemo, useState } from "react";
import { getInscriptionRankPda } from "@libreplex/shared-ui";
import { decodeInscriptionRankPage } from "@libreplex/shared-ui";
import { useFetchSingleAccount } from "@libreplex/shared-ui";
import { Button, HStack, Heading, VStack } from "@chakra-ui/react";
import { InscriptionCardLegacy } from "../InscriptionCardLegacy";
import { Paginator } from "@app/components/Paginator";
import { useInscriptionSummary } from "../../useInscriptionsSummary";

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

  const {data: inscriptionSummary} = useInscriptionSummary()

  const ITEMS_PER_PAGE = 50;
  const [currentPage, setCurrentPage] = useState<number>(0);

  const { item, pubkey } = useMemo(
    () =>{

    
      const start = Math.max(Number(inscriptionSummary.item.inscriptionCountTotal) - (currentPage +1) * ITEMS_PER_PAGE,0);
      const end = Math.max(Number(inscriptionSummary.item.inscriptionCountTotal) - (currentPage ) * ITEMS_PER_PAGE,0);
      
      return data && inscriptionSummary
        ? decodeInscriptionRankPage(
            data?.item?.buffer,
            data.pubkey,
            start,
            end
          )
        : { item: null, pubkey: inscriptionPageId }
    },
    [currentPage, data, inscriptionPageId, inscriptionSummary]
  );

  const maxPages = useMemo(
    () => {
      // console.log({l: data?.item?.buffer.length, m: Math.ceil((data?.item?.buffer.length - 12 ) / 32 / ITEMS_PER_PAGE)});
      return Math.ceil((data?.item?.buffer.length - 12 ) / 32 / ITEMS_PER_PAGE)
    },
    [data?.item?.buffer.length]
  );

  const inscriptionKeysReversed = useMemo(()=>item?.inscriptionKeys.reverse(),[item?.inscriptionKeys])
  

  return (
    <VStack className="w-full">
      <Heading pt={3} size={"md"}>
        Showing {item?.inscriptionKeys.length} items
      </Heading>
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
        {inscriptionKeysReversed?.map((item, idx) => (
          <InscriptionCardLegacy inscriptionId={item} key={idx} />
        ))}
      </HStack>
    </VStack>
  );
};
