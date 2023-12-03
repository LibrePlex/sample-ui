import { Center, HStack, Td, Tr, Text } from "@chakra-ui/react";

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

  const { data: mintsInMyWallet } = useLegacyMintsByWallet(
    publicKey,
    connection
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
        {isMine ? (
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
        )}
      </Center>
    </HStack>
  );
};
