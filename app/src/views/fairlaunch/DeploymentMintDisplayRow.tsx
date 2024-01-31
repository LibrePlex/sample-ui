import {
  Center,
  HStack,
  Td,
  Tr,
  Text,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  Flex,
  Box,
  VStack,
  UnorderedList,
  ListItem,
  PopoverBody,
  Heading,
} from "@chakra-ui/react";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { SwapToFungibleTransactionButton } from "./SwapToFungibleTransactionButton";
import { SwapToNonFungibleTransactionButton } from "./SwapToNonFungibleTransactionButton";
import {
  CopyPublicKeyButton,
  Deployment,
  IRpcObject,
  MintWithTokenAccount,
  useLegacyMintsByWallet,
} from "@libreplex/shared-ui";
import { useMemo } from "react";
import { useTokenProgramForDeployment } from "./useTokenProgramsForDeployment";
import { InfoIcon } from "@chakra-ui/icons";

export const DeploymentMintDisplayRow = ({
  mint,
  deployment,
}: {
  mint: MintWithTokenAccount;
  deployment: IRpcObject<Deployment>;
}) => {
  const { connection } = useConnection();

  const { publicKey } = useWallet();

  const isMine = useMemo(
    () => mint.tokenAccount.item.owner.toBase58() === publicKey?.toBase58(),
    [mint, publicKey]
  );

  const tokenProgram = useTokenProgramForDeployment(deployment);

  const { data: mintsInMyWallet } = useLegacyMintsByWallet(
    publicKey,
    connection,
    tokenProgram
  );

  const fungibleTokenAccount = useMemo(
    () =>
      mintsInMyWallet.find(
        (item) =>
          item.mint.toBase58() === deployment.item.fungibleMint.toBase58()
      ),
    [mintsInMyWallet, deployment]
  );

  return (
    <HStack justifyContent={"space-between"} m={1}>
      <CopyPublicKeyButton publicKey={mint.mint.toBase58()} />
      <Center>
        Swaps disabled{" "}
        <Popover size="md">
          <PopoverTrigger>
            <Button colorScheme="white" variant="outline">
              <InfoIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverHeader>
              <Flex justify="space-between" align="center" p={2}>
                <Box>
                  <Text as="b">...tf??</Text>
                </Box>
              </Flex>
            </PopoverHeader>
            <PopoverBody>
              <Text maxWidth="300px">
                Swaps are disabled on libreplex.io as the site moves towards
                read-only. The end-goal of libreplex is to encourage ecosystem
                around libreplex, and that means providing protocols and IDLs
                for system integration.
              </Text>
              <Text maxWidth="300px">
                In the long run, all write functionality will be provided by
                third parties that are building creative solutions on top of
                free libreplex protocols!
              </Text>
              <Text maxWidth="300px">
                Please use an external swap service or roll your own! The swap
                button examples are retained in the source code - you are
                encouraged to dig in and experiment.
              </Text>
              <Heading size="md" maxWidth="300px">
                All code is open source so there are no barriers to entry. It is 
                a fair game for all!
              </Heading>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        {/* {isMine ? (
          <SwapToFungibleTransactionButton
            params={{
              deployment,
              nonFungibleMint: mint,
            }}
            formatting={{}}
          />
        ) : fungibleTokenAccount ? (
          <SwapToNonFungibleTransactionButton
            params={{
              fungibleTokenAccount,
              deployment,
              nonFungibleMint: mint,
            }}
            formatting={undefined}
          />
        ) : (
          <Text>Not enough {deployment.item.ticker}</Text>
        )} */}
      </Center>
    </HStack>
  );
};
