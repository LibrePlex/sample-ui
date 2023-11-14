import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  Text,
} from "@chakra-ui/react";
import { RawAccount } from "@solana/spl-token";

import React, { useEffect, useMemo, useState } from "react";
import {
  Collection,
  GroupSelector,
  IRpcObject,
  Metadata,
  useLegacyMetadataByMintId,
  useMultiSigById
} from "@libreplex/shared-ui";
import { PublicKey } from "@solana/web3.js";
import { connect } from "http2";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { InscribeAsUauthPanel } from "./InscribeAsUauthPanel";
import { InscribeAsHolderPanel } from "./InscribeAsHolderPanel";
import { useOwnerOfMint } from "app/src/hooks/useOwnerOfMint";
import { useSquadsByUauth } from "./useSquadsByUauth";

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
    () => publicKey && metadata?.item ? metadata?.item?.updateAuthority?.equals(publicKey) : false,
    [metadata, publicKey]
  );

  

  const { data: ownerTokenAccount } = useOwnerOfMint(mint);

  const isHolder = useMemo(
    () => ownerTokenAccount && publicKey ? ownerTokenAccount?.tokenAccount.item.owner.equals(publicKey) : false,
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
