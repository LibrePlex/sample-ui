import { Box, Td, Tr, VStack, Text, Spinner } from "@chakra-ui/react";
import {
  CopyPublicKeyButton,
  ScannerLink,
  SolscanLink,
  TensorButton,
  useInscriptionForRoot,
  useLegacyMetadataByMintId,
  useOffChainMetadataCache,
} from "@libreplex/shared-ui";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { InscriptionImage } from "@libreplex/shared-ui";
import { CreateNewLegacyInscriptionModal } from "./CreateNewLegacyInscriptionModal";
import React, { useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export const MintMigratorRow = ({ mint }: { mint: PublicKey }) => {
  const { publicKey } = useWallet();
  const { data } = useOffChainMetadataCache(mint);
  const { connection } = useConnection();
  const { data: legacyMetadata, isFetching } = useLegacyMetadataByMintId(
    mint,
    connection
  );

  const { inscription } = useInscriptionForRoot(mint);

  const haveUauth = useMemo(
    () =>
      legacyMetadata?.item?.updateAuthority &&
      publicKey?.equals(legacyMetadata?.item.updateAuthority),
    [legacyMetadata, publicKey]
  );

  const isImmutable = useMemo(
    () => inscription?.data?.item?.authority.equals(SystemProgram.programId),
    [inscription]
  );

  return (
    <Tr>
      <Td>
        <CopyPublicKeyButton publicKey={mint.toBase58()} />
      </Td>
      <Td>{data?.name}</Td>
      <Td>
        <div className="rounded-md overflow-hidden min-h-24 h-24 max-h-24 max-w-24 w-24 relative">
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
        <div className="rounded-md overflow-hidden max-h-24 min-h-24 max-w-24 w-24">
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
        {isFetching && <Spinner />}
        {haveUauth ? (
          isImmutable ? (
            <Text>Immutable inscription</Text>
          ) : (
            <CreateNewLegacyInscriptionModal mint={mint} />
          )
        ) : (
          <Text>No update auth</Text>
        )}
      </Td>
    </Tr>
  );
};
