import { useConnection } from "@solana/wallet-adapter-react";
import { useMemo, useState } from "react";
import { getInscriptionRankPda } from "@libreplex/shared-ui";
import { decodeInscriptionRankPage } from "@libreplex/shared-ui";
import { useFetchSingleAccount } from "@libreplex/shared-ui";
import { Button, HStack, Heading, Input, VStack, Text } from "@chakra-ui/react";
import { InscriptionCardLegacy } from "../InscriptionCardLegacy";
import { Paginator } from "@app/components/Paginator";
import { useInscriptionSummary } from "../../useInscriptionsSummary";
import {useDebounce} from "use-debounce";
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

  const { data: inscriptionSummary } = useInscriptionSummary();

  const ITEMS_PER_PAGE = 50;
  const [currentPage, setCurrentPage] = useState<number>(0);


  const [startPosition, setStartPosition] = useState<string>("");

  const effectiveStartPositionCurrent = useMemo(() => {
    try {
      return Math.floor(+startPosition);
    } catch (e) {
      return null;
    }
  }, [startPosition]);

  const [effectiveStartPosition] = useDebounce(effectiveStartPositionCurrent, 250);

  const { item, pubkey } = useMemo(() => {
    if (inscriptionSummary && data) {
      
      const end = Math.max(
        (effectiveStartPosition || Number(inscriptionSummary.item.inscriptionCountTotal))-
          currentPage * ITEMS_PER_PAGE,
        0
      );

      const start = Math.max(0, end - ITEMS_PER_PAGE);

      console.log({start, end});

      return decodeInscriptionRankPage(
        data?.item?.buffer,
        data.pubkey,
        start,
        end
      );
    } else {
      return { item: null, pubkey: inscriptionPageId };
    }
  }, [currentPage, data, inscriptionPageId, inscriptionSummary, effectiveStartPosition]);

  const maxPages = useMemo(() => {
    // console.log({l: data?.item?.buffer.length, m: Math.ceil((data?.item?.buffer.length - 12 ) / 32 / ITEMS_PER_PAGE)});
    return Math.ceil((effectiveStartPosition || ((data?.item?.buffer.length - 12)) / 32) / ITEMS_PER_PAGE);
  }, [data?.item?.buffer.length, effectiveStartPosition]);

  const inscriptionKeysReversed = useMemo(
    () => item?.inscriptionKeys.reverse(),
    [item?.inscriptionKeys]
  );


  return (
    <VStack className="w-full">
      <Heading pt={3} size={"md"}>
        Showing latest {item?.inscriptionKeys.length} inscriptions
      </Heading>
      <HStack>
        <Text color="white">Start from #</Text>
        <Input
          sx={{ maxWidth: "200px" }}
          value={startPosition}
          onChange={(e) => setStartPosition(e.currentTarget.value)}
        />
      </HStack>
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
