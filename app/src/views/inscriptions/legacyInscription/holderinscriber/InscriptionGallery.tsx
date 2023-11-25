import {Heading, HStack, Text, VStack} from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import React, { useState } from "react";
import { useInscriptionSummary } from "../../useInscriptionsSummary";
import {useQuery} from "react-query";
import {DisappearingBox} from "@app/components/DisappearingBox";
import {MintCardLegacy} from "@app/views/inscriptions/legacyInscription/mintcard/MintCardLegacy";
import {PublicKey} from "@solana/web3.js";
import {ViewLegacyInscription} from "@app/views/inscriptions/legacyInscription/ViewLegacyInscription";

const latestInscriptionsUrl = "https://inscription-index.pinit.io/"
const ITEMS_PER_PAGE = 10;
export const InscriptionGallery = () => {
  const latestInscriptions = useQuery<{
    mint: string,
    order: number,
  }[]>([], async () => {
    return ((await (await fetch(latestInscriptionsUrl)).json()) as any[]).reverse().slice(0, ITEMS_PER_PAGE)
  }, {
    refetchInterval: 5000,
  })

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
        Showing {ITEMS_PER_PAGE} latest inscriptions
        {/* Showing latest {item?.inscriptionKeys.length} inscriptions */}
      </Heading>
      {/* <Heading pt={3} size={"md"}> */}
      {/* Showing latest {item?.inscriptionKeys.length} inscriptions */}
      {/* </Heading> */}
      {/* <HStack>
        <Text color="white">Start from #</Text>
        <Input
          sx={{ maxWidth: "200px" }}
          value={startPosition}
          onChange={(e) => setStartPosition(e.currentTarget.value)}
        />
      </HStack> */}
      {/* <Paginator
        onPageChange={setCurrentPage}
        pageCount={maxPages}
        currentPage={currentPage}
      /> */}
      <VStack className="w-full">
        <HStack
            gap={8}
            alignItems="flex-start"
            justifyContent="center"
            flexWrap="wrap"
        >
          {latestInscriptions?.data?.map((item, idx) => (
              <DisappearingBox key={idx} >
                <MintCardLegacy mintId={new PublicKey(item.mint)}>
                  {/*<ViewLegacyInscription mint={new PublicKey(item.mint)} />*/}
                </MintCardLegacy>
              </DisappearingBox>
          ))}
        </HStack>
      </VStack>
    </VStack>
  );
};
