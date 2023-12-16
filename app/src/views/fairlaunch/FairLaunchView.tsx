import { Paginator, usePaginator } from "@app/components/Paginator";
import { FaArrowDownShortWide } from "react-icons/fa6";
import { FaArrowUpWideShort } from "react-icons/fa6";
import { FaSortAlphaDown } from "react-icons/fa";
import { FaSortAlphaUp } from "react-icons/fa";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  HStack,
  Heading,
  IconButton,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useMemo, useState } from "react";
import { SmallCardTemplate } from "./SmallCardTemplate";
import { useFairLaunchDeployments } from "./useFairLaunchDeployments";
import React from "react";

enum View {
  InscriptionGallery,
  Inscriber,
  CustomMints,
}

enum OrderBy {
  Name,
  ValCount,
}

enum SortOrder {
  Asc,
  Desc,
}

const FairLaunchView = () => {
  const [deploymentCount, setDeploymentCount] = useState<number>();

  const { connection } = useConnection();

  const { deployments, processing } = useFairLaunchDeployments();

  const [orderBy, setOrderBy] = useState<OrderBy>(OrderBy.ValCount);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.Desc);

  const orderedValidators = useMemo(() => {
    return [...deployments]
      .filter(
        (item) =>
          item.pubkey.toBase58() !==
          "G2MKngkSEF6vdmGDCXDsEAc8dEh6hfLryTdiS1b5q5hv"
      )
      .sort(
        (a, b) =>
          (sortOrder === SortOrder.Asc ? 1 : -1) *
          (orderBy === OrderBy.ValCount
            ? -Number(b.item.numberOfTokensIssued) +
              Number(a.item.numberOfTokensIssued)
            : a.item.ticker
                .toLocaleLowerCase()
                .localeCompare(b.item.ticker.toLocaleUpperCase()))
      );
  }, [deployments, sortOrder, orderBy]);

  const { publicKey } = useWallet();

  const { setCurrentPage, maxPages, currentPage, currentPageItems } =
    usePaginator(orderedValidators, 10);

  //  const lastValidations = useMemo(()=>getLastValidationsPda()[0],[])

  // const {data} = useLastValidations(lastValidations, connection)

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          LibrePlex Fair Launch
        </h1>

        <h1 className="text-center font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Showing all Fair Launches as well as Launches migrated from legacy validators
        </h1>

        <Box
          display="flex"
          columnGap={"20px"}
          flexDirection="column"
          alignContent={'center'}
          className="w-full"
        >
          <Box display="flex" flexDirection={"column"}        alignItems={'center'} gap={4}>
            <HStack>
              <Text>Sort by</Text>
              <Button
                onClick={(e) => {
                  setOrderBy(OrderBy.ValCount);
                  setSortOrder(SortOrder.Asc);
                  setCurrentPage(0);
                }}
                colorScheme={"teal"}
                variant={orderBy === OrderBy.ValCount ? "solid" : "outline"}
              >
                Val count
              </Button>
              <Button
                onClick={(e) => {
                  setOrderBy(OrderBy.Name);
                  setSortOrder(SortOrder.Asc);
                  setCurrentPage(0);
                }}
                colorScheme={"teal"}
                variant={orderBy === OrderBy.Name ? "solid" : "outline"}
              >
                Name
              </Button>

              <IconButton
                aria-label={"sort asc"}
                onClick={(e) => {
                  setSortOrder(SortOrder.Asc);
                }}
                colorScheme={"teal"}
                variant={sortOrder === SortOrder.Asc ? "solid" : "outline"}
              >
                {orderBy === OrderBy.Name ? (
                  <FaSortAlphaDown />
                ) : (
                  <FaArrowDownShortWide />
                )}
              </IconButton>
              <IconButton
                onClick={(e) => {
                  setSortOrder(SortOrder.Desc);
                }}
                colorScheme={"teal"}
                variant={sortOrder === SortOrder.Desc ? "solid" : "outline"}
                aria-label={"sort desc"}
              >
                {orderBy === OrderBy.Name ? (
                  <FaSortAlphaUp />
                ) : (
                  <FaArrowUpWideShort />
                )}
              </IconButton>
            </HStack>
            {processing && (
              <HStack>
                <Spinner /> <Text>Processing deployments</Text>
              </HStack>
            )}
            <Paginator
              onPageChange={setCurrentPage}
              pageCount={maxPages}
              currentPage={currentPage}
            />
            <SimpleGrid
              columns={4}
              spacing={4}
              templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
            >
              {/* <GotoWalletCard validatorCount={validators?.length} /> */}
              {currentPageItems
                ?.filter((item) => item)
                .map((item, idx) => (
                  <SmallCardTemplate
                    key={idx}
                    deploymentPublicKey={new PublicKey(item.pubkey)}
                  />
                ))}
            </SimpleGrid>
          </Box>
        </Box>
      </div>
    </div>
  );
};
<Box rowGap={2} display={"flex"} flexDir={"column"}>
  <Heading size={"lg"}>Native Licensing</Heading>
  <Text maxW={"500px"}>Licensing built into the asset contracts.</Text>
  <Text maxW={"500px"}>
    {
      '"The holder of this NFT is allowed to print 37 copies of the NFT on a t-shirt of their choice."'
    }
  </Text>
</Box>;
export default FairLaunchView;
