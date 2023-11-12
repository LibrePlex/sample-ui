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

import React, { useState } from "react";
import {
  Collection,
  GroupSelector,
  IRpcObject,
  Metadata,
  useLegacyMetadataByMintId,
} from "@libreplex/shared-ui";
import { PublicKey } from "@solana/web3.js";
import { connect } from "http2";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
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
  
  return (
    <ModalBody>
      <Box p={2}>
        <Text>
          Legacy Metaplex mints can be inscribed using LibrePlex inscriptions.
          If you inscribe a mint that you hold but do not have update authority
          on, you can only inscribe the current off-chain image. If you inscribe
          a mint that you have update authority on, you can also override the
          off-chain image to anything you want, such as custom pixel art.
        </Text>
      </Box>
      <InscribeAsUauthPanel mint={mint}/>
    </ModalBody>
  );
};
