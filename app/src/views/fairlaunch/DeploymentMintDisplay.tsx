import {
  Box,
  Heading,
  SimpleGrid,
  VStack,
  useMediaQuery,
  Text,
  Button,
} from "@chakra-ui/react";

import { DeploymentMintDisplayRow } from "./DeploymentMintDisplayRow";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Deployment,
  IRpcObject,
  MintWithTokenAccount,
} from "@libreplex/shared-ui";
import { Paginator, usePaginator } from "@app/components/Paginator";

export const DeploymentMintDisplay = ({
  mintsInWallet,
  mintsInEscrow,
  deployment,
}: {
  mintsInEscrow: MintWithTokenAccount[];
  mintsInWallet: MintWithTokenAccount[];
  deployment: IRpcObject<Deployment>;
}) => {
  const {
    setCurrentPage: setCurrentPageWallet,
    maxPages: maxPagesWallet,
    currentPage: currentPageWallet,
    currentPageItems: currentPageItemsWallet,
  } = usePaginator(mintsInWallet, 10);

  const {
    setCurrentPage: setCurrentPageEscrow,
    maxPages: maxPagesEscrow,
    currentPage: currentPageEscrow,
    currentPageItems: currentPageItemsEscrow,
  } = usePaginator(mintsInEscrow, 10);

  const [narrowScreen] = useMediaQuery("(max-width: 600px)");

  const { publicKey } = useWallet();

  return (
    <VStack>
      
    <SimpleGrid columns={narrowScreen ? 1 : 2} gap={2}>
      <VStack className="border-2 p-2">
        <Heading size="md">Your wallet</Heading>
        <Paginator
          onPageChange={setCurrentPageWallet}
          pageCount={maxPagesWallet}
          currentPage={currentPageWallet}
        />
        <VStack>
          {currentPageItemsWallet?.map((item, idx) => (
            <DeploymentMintDisplayRow
              key={idx}
              mint={item}
              deployment={deployment}
            />
          ))}
        </VStack>
        <Box p={3} maxWidth="300px">
          {publicKey ? (
            <Heading size="md">
              You have {(mintsInWallet?.length ?? 0)>0?mintsInWallet.length : "no NFTs from this deployment in your wallet."}
            </Heading>
          ) : (
            <Heading size="md">Please connect your wallet.</Heading>
          )}
        </Box>
      </VStack>
      <VStack className="border-2 p-2">
        <Heading size="md">Escrow</Heading>
        <Text maxW={'200px'}>
          You need{" "}
          {deployment.item
            ? Number(deployment?.item?.limitPerMint).toLocaleString()
            : ""}{" "}
          {deployment.item.ticker} tokens to swap for an NFT
        </Text>
        <Paginator
          onPageChange={setCurrentPageEscrow}
          pageCount={maxPagesEscrow}
          currentPage={currentPageEscrow}
        />

        {currentPageItemsEscrow?.map((item, idx) => (
          <DeploymentMintDisplayRow
            key={idx}
            mint={item}
            deployment={deployment}
          />
        ))}
      </VStack>
    </SimpleGrid>
    </VStack>
  );
};
