import {
  ModalBody,
  Text
} from "@chakra-ui/react";

import {
  useLegacyMetadataByMintId
} from "@libreplex/shared-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useOwnerOfMint } from "app/src/hooks/useOwnerOfMint";
import { useMemo } from "react";
import { InscribeAsHolderPanel } from "./InscribeAsHolderPanel";
import { InscribeAsUauthPanel } from "./InscribeAsUauthPanel";

enum InscribeAs {
  Uauth,
  Holder,
}

export const CreateNewLegacyInscriptionModalBody = ({
  mint,
}: {
  mint: PublicKey;
}) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const metadata = useLegacyMetadataByMintId(mint, connection);

  const isUauth = useMemo(
    () =>
      publicKey && metadata?.data?.item
        ? metadata?.data.item.updateAuthority?.equals(publicKey)
        : false,
    [metadata, publicKey]
  );

  const { data: ownerTokenAccount } = useOwnerOfMint(mint);

  const isHolder = useMemo(
    () =>
      ownerTokenAccount && publicKey
        ? ownerTokenAccount?.tokenAccount.item.owner.equals(publicKey)
        : false,
    [ownerTokenAccount, publicKey]
  );

  return (
    <ModalBody>
      {isUauth && <InscribeAsUauthPanel mint={mint} />}
      {isHolder && !isUauth && (
        <InscribeAsHolderPanel mint={ownerTokenAccount} />
      )}
      {!isHolder && !isUauth && (
        <Text>
          You must be the holder or the update authority to inscribe a mint
        </Text>
      )}
    </ModalBody>
  );
};
