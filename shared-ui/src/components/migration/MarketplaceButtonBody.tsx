import { PublicKey } from "@solana/web3.js";
import {
  useInscriptionForRoot,
  useInscriptionV3ForRoot,
  useOffChainMetadataCache,
} from "@libreplex/shared-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { Box, Center, IconButton, HStack, VStack, Text, Spinner } from "@chakra-ui/react";
import React from "react";
import { MigrateToV3TransactionButton } from "./MigrateToV3TransactionButton";


export const MarketplaceButtonBody = ({ mint }: { mint: PublicKey }) => {
  const { inscription: inscriptionV3 } = useInscriptionV3ForRoot(mint, true);

  const { inscription } = useInscriptionForRoot(mint);

  const { data: offchainData } = useOffChainMetadataCache(mint);

  const { publicKey } = useWallet();

  return inscriptionV3.isFetching ? <Spinner/> :inscriptionV3.data.item ? (
    <HStack align={"start"} pb={4}>
      <IconButton
        aria-label={"tensorhq"}
        background={'black'}
        mb={2}
        onClick={() => {
          window.open(`https://www.tensor.trade/item/${mint.toBase58()}`);
        }}
      >
        <img src="/tensorhq-white.png" style={{ height: "28px" }} />
      </IconButton>
      <IconButton
          aria-label={"me"}
          background={"black"}
          onClick={() => {
            window.open(`https://magiceden.io/item-details/${mint.toBase58()}`);
          }}
        >
          <img src="/ME_Logo_Gradient_BG.png" style={{ height: "28px" }} />
        </IconButton>
        <IconButton
          aria-label={"solsniper"}
          background={"black"}
          onClick={() => {
            window.open(`https://sniper.xyz`);
          }}
        >
          <img src="/sniper_square.png" style={{ height: "28px" }} />
        </IconButton>
      <Box>
        <Text pb={3}>
          This item has succesfully been migrated onto V3 inscriptions index.
        </Text>
        <Text>
          Please click on the links to buy / sell inscriptions.
        </Text>
      </Box>
    </HStack>
  ) : (
    <Center>
      <VStack align={"start"}>
        <Box>
          <Text pb={3}>
            New Solana inscriptions are created in version V3. They are trading
            happily on TensorHQ without a care in the world.
          </Text>
          <Text pb={3}>
            Please help me migrate to V3. Your address will recorded forever in
            the history of Solana as my migrator and liberator.
          </Text>

          <Text pb={3}>Sincerely,</Text>

          <Text>{offchainData?.name}</Text>

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
  );
};
