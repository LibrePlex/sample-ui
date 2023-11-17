import {
  CopyPublicKeyButton,
  IRpcObject,
  Inscription,
  ScannerLink,
} from "shared-ui/src";
import { Heading, Text, VStack } from "@chakra-ui/react";
import { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export const MutableInscription = ({
  inscription,
}: {
  inscription: IRpcObject<Inscription>;
}) => {
  const { publicKey } = useWallet();

  
  return (
    <VStack alignItems={"start"}>
      <Text>
        NEVER buy a mutable inscription on a marketplace / OTC.
      </Text>
      <Text>The current holder is not necessarily the creator.</Text>
      <Text>Immutability deploys on 17 Nov 2023.</Text>
      <ScannerLink mintId={inscription?.item?.root} />
    </VStack>
  );
};
