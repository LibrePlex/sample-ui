import { Paginator } from "@app/components/Paginator";
import { HStack, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useInscriptionSummary } from "../../useInscriptionsSummary";
import { InscriptionCardLegacy } from "../InscriptionCardLegacy";
export const InscriptionGallery = () => {
  // const inscriptionPageId = useMemo(
  //   () => getInscriptionRankPda(BigInt(0))[0],
  //   []
  // ); // for now consider the first inscription page only

  const { connection } = useConnection();
  // const { data, refetch } = useFetchSingleAccount(
  //   inscriptionPageId,
  //   connection
  // );

  const { data: inscriptionSummary } = useInscriptionSummary();

  // const ITEMS_PER_PAGE = 25;
  const [currentPage, setCurrentPage] = useState<number>(0);


  const [startPosition, setStartPosition] = useState<string>("");

  // const effectiveStartPositionCurrent = useMemo(() => {
  //   try {
  //     return Math.floor(+startPosition);
  //   } catch (e) {
  //     return null;
  //   }
  // }, [startPosition]);

  // const [effectiveStartPosition] = useDebounce(effectiveStartPositionCurrent, 250);

  // const { item, pubkey } = useMemo(() => {
  //   if (inscriptionSummary && data) {
      
  //     const end = Math.max(
  //       (effectiveStartPosition || Number(inscriptionSummary.item.inscriptionCountTotal))-
  //         currentPage * ITEMS_PER_PAGE,
  //       0
  //     );

  //     const start = Math.max(0, end - ITEMS_PER_PAGE);

  //     // return decodeInscriptionRankPage(
  //     //   data?.item?.buffer,
  //     //   data.pubkey,
  //     //   start,
  //     //   end
  //     // );
  //   } else {
  //     return { item: null, pubkey: inscriptionPageId };
  //   }
  // }, [currentPage, data, inscriptionPageId, inscriptionSummary, effectiveStartPosition]);

  // const maxPages = useMemo(() => {
  //   // console.log({l: data?.item?.buffer.length, m: Math.ceil((data?.item?.buffer.length - 12 ) / 32 / ITEMS_PER_PAGE)});
  //   return Math.ceil((effectiveStartPosition || ((data?.item?.buffer.length - 12)) / 32) / ITEMS_PER_PAGE);
  // }, [data?.item?.buffer.length, effectiveStartPosition]);

  // const inscriptionKeysReversed = useMemo(
  //   () => item?.inscriptionKeys.reverse(),
  //   [item?.inscriptionKeys]
  // );


  return (
    <VStack className="w-full">
      <Heading pt={3} size={"md"}>
        {/* Showing latest {item?.inscriptionKeys.length} inscriptions */}
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
        <Heading size="sm">The gallery view of libreplex has been currently disabled because of the very large size of the inscription rank page account.</Heading>
        <Text>As you can see in the summary above, we currently have 189k accounts and counting!</Text>
        <Text>We will formulate a sustainable, properly indexed infrastructure solution in the coming days and keep you posted.
          In the meantime, the libre editor / wallet browser and scanners remain fully functional.
        </Text>
        {/* {inscriptionKeysReversed?.map((item, idx) => (
          <InscriptionCardLegacy inscriptionId={item} key={idx} />
        ))} */}
      </HStack>
    </VStack>
  );
};
