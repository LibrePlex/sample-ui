import { Paginator, usePaginator } from "@app/components/Paginator";
import { CreateDeploymentDialog } from "@app/views/fairlaunch/CreateDeploymentDialog";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  HStack,
  Heading,
  SimpleGrid,
  Spinner,
  Stack,
  Text
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useMemo, useState } from "react";
import { ValidatorImporterDetail } from "./ValidatorImporterDetail";
import { useLegacyValidators } from "./useLegacyValidators";

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

const LegacyImporterView = () => {
  const [deploymentCount, setDeploymentCount] = useState<number>();

  const [orderBy, setOrderBy] = useState<OrderBy>(OrderBy.ValCount);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.Desc);

  const { validators, processing } = useLegacyValidators();

  const orderedValidators = useMemo(() => {
    return [...validators]
      .filter(
        (item) =>
          item.pubkey.toBase58() !==
          "G2MKngkSEF6vdmGDCXDsEAc8dEh6hfLryTdiS1b5q5hv"
      )
      .sort(
        (a, b) =>
          (sortOrder === SortOrder.Asc ? 1 : -1) *
          (orderBy === OrderBy.ValCount
            ? -Number(b.item.validationCountCurrent) +
              Number(a.item.validationCountCurrent)
            : a.item.ticker
                .toLocaleLowerCase()
                .localeCompare(b.item.ticker.toLocaleUpperCase()))
      );
  }, [validators, sortOrder, orderBy]);

  const { publicKey } = useWallet();

  const { setCurrentPage, maxPages, currentPage, currentPageItems } =
    usePaginator(orderedValidators, 10);

  //  const lastValidations = useMemo(()=>getLastValidationsPda()[0],[])

  // const {data} = useLastValidations(lastValidations, connection)

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Fair Launch
        </h1>

        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Life is not fair. But launches can be.
        </h1>

        <Box
          display="flex"
          columnGap={"20px"}
          flexDirection="column"
          className="w-full"
        >
          <Box display="flex" flexDirection={"column"}>
            <Box
              sx={{
                mt: 0,
                pt: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pb: 5,
              }}
            >
              <Card
                sx={{ width: "100%", maxWidth: "100%" }}
                direction={{ base: "column", sm: "row" }}
                overflow="hidden"
                variant="outline"
                mb={2}
              >
                <Stack sx={{ width: "100%" }}>
                  <CardBody sx={{ width: "100%" }}>
                    <HStack>
                      <Heading size="md">
                        {deploymentCount} deployments created
                      </Heading>
                    </HStack>
                  </CardBody>

                  <CardFooter justifyContent={"end"}>
                    <CreateDeploymentDialog />
                  </CardFooter>
                </Stack>
              </Card>
            </Box>
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
              {currentPageItems
                ?.filter((item) => item)
                .map((item, idx) => (
                  <ValidatorImporterDetail key={idx} item={item} />
                ))}
            </SimpleGrid>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default LegacyImporterView;
