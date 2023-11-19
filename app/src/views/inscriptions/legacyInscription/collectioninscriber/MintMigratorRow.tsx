import { Box, Td, Tr, VStack, Text, Spinner } from "@chakra-ui/react";
import {
  CopyPublicKeyButton,
  ScannerLink,
  SolscanLink,
  TensorButton,
  useLegacyMetadataByMintId,
  useOffChainMetadataCache,
} from "@libreplex/shared-ui";
import { PublicKey } from "@solana/web3.js";
import { InscriptionImage } from "shared-ui/src/components/inscriptionDisplay/InscriptionImage";
import { CreateNewLegacyInscriptionModal } from "./CreateNewLegacyInscriptionModal";
import React, { useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export const MintMigratorRow = ({ mint }: { mint: PublicKey }) => {
  const { publicKey } = useWallet();
  const { data} = useOffChainMetadataCache(mint);
  const { connection } = useConnection();
  const {data: legacyMetadata, isFetching} = useLegacyMetadataByMintId(mint, connection);

  const haveUauth = useMemo(
    () => legacyMetadata?.item.updateAuthority && publicKey?.equals(legacyMetadata?.item.updateAuthority),
    [legacyMetadata, publicKey]
  );

  return (
    <Tr>
      <Td>
        <CopyPublicKeyButton publicKey={mint.toBase58()} />
      </Td>
      <Td>{data?.name}</Td>
      <Td>
        <div className="rounded-md overflow-hidden max-h-24 max-w-24 w-24 relative">
          {/* <div className="object-cover"> */}
          <img
            src={data?.images.square ?? ""}
            className="object-cover max-w-full max-h-full h-full h-24 w-24"
            // style={{height: '100px'}}
          />
          <Box className="absolute top-1 right-1">
            <SolscanLink address={mint.toBase58()} />
          </Box>
          {/* </div> */}
        </div>
      </Td>

      <Td>
        <div className="rounded-md overflow-hidden max-h-24 max-w-24 w-24 h-full">
          <InscriptionImage
            root={mint}
            // stats={false}
          />
        </div>
      </Td>
      <Td>
        <VStack>
          <ScannerLink mintId={mint} />
        </VStack>
      </Td>
      <Td>
        <VStack>
          <TensorButton mint={mint} />
        </VStack>
      </Td>
      <Td>
        {isFetching && <Spinner/>}
        {haveUauth ? (
          <CreateNewLegacyInscriptionModal mint={mint} />
        ) : (
          <Text>No update auth</Text>
        )}
      </Td>
    </Tr>
  );
};
