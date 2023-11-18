import { FaEarlybirds } from "react-icons/fa6";
import { InfoIcon } from "@chakra-ui/icons";
<Text as="b">Dynamic Rendering</Text>;
import {
  Box,
  Button,
  Center,
  Flex,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  VStack,
  Text,
  UnorderedList,
  ListItem,
  IconButton,
  Portal,
} from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { useInscriptionV3ById } from "shared-ui/src/sdk/query/inscriptions/inscriptionsV3";
import { useInscriptionV3ForRoot } from "shared-ui/src/sdk/query/inscriptions/useInscriptionV2ForRoot";
import { MigrateToV3TransactionButton } from "../../v3migration/MigrateToV3TransactionButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { useInscriptionForRoot, useOffChainMetadataCache } from "shared-ui/src";

export const TensorButton = ({ mint }: { mint: PublicKey }) => {
  const { inscription: inscriptionV3 } = useInscriptionV3ForRoot(mint, true);

  const { inscription } = useInscriptionForRoot(mint);

  const { data: offchainData } = useOffChainMetadataCache(mint);

  const { publicKey } = useWallet();
  return inscriptionV3.data.item ? (
    <IconButton
      aria-label={"tensorhq"}
      onClick={() => {
        window.open(`https://www.tensor.trade/item/${mint.toBase58()}`);
      }}
    >
      <img src="/tensorhq.png" style={{ height: "28px" }} />
    </IconButton>
  ) : (
    <Popover size="md">
      <PopoverTrigger>
        <IconButton aria-label={"help-me-migrate"}>
          <FaEarlybirds />
        </IconButton>
      </PopoverTrigger>
      <Portal>
        <Box zIndex="popover">
          <PopoverContent>
            <PopoverArrow />
            <PopoverHeader>
              <Flex
                justify="space-between"
                align="center"
                justifyContent={"space-between"}
                p={2}
              >
                <Box>
                  <Text as="b">
                    Dear {publicKey?.toBase58().slice(0, 6)}...
                  </Text>
                </Box>
                <img
                  src={offchainData?.images?.square}
                  height="42px"
                  width="42px"
                />
              </Flex>
            </PopoverHeader>
            <Box p={5}>
              <Center>
                <VStack align={"start"}>
                  <Box>
                    <Text pb={3}>
                      New Solana inscriptions are created in version V3. They
                      are trading happily on TensorHQ without a care in the
                      world.
                    </Text>
                    <Text pb={3}>
                      Please help me migrate to V3. Your address will recorded forever
                      in the history of Solana as my migrator and liberator.
                    </Text>

                    <Text pb={3}>
                      Sincerely,
                    </Text>

                    <Text>
                      {offchainData?.name} 
                    </Text>

                    <Text pb={3}>
                      Inscription #
                      {Number(inscription?.data?.item?.order).toLocaleString()}
                    </Text>

                    <MigrateToV3TransactionButton
                      params={{ root: mint }}
                      formatting={{}}
                    />
                  </Box>
                </VStack>
              </Center>
            </Box>
          </PopoverContent>
        </Box>
      </Portal>
    </Popover>
  );
};
