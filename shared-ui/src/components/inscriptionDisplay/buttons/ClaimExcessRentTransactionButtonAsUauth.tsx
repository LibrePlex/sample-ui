import {
  CopyPublicKeyButton,
  GenericTransactionButton,
  GenericTransactionButtonProps,
  IExecutorParams,
  ITransactionTemplate,
  LibreWallet,
  PROGRAM_ID_INSCRIPTIONS,
  getInscriptionDataPda,
  getInscriptionPda,
  getInscriptionV3Pda,
  getLegacyInscriptionPda,
  getLegacyMetadataPda,
  getProgramInstanceLegacyInscriptions,
  useInscriptionDataForRoot,
  useInscriptionV3ForRoot,
  useLegacyMetadataByMintId,
} from "@libreplex/shared-ui";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";

import { HStack, Text } from "@chakra-ui/react";

import { notify } from "@libreplex/shared-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useMemo } from "react";
import { getRentFromDataLength } from "../../../components/useRentForDataLength";

export interface IRemoveFromGroup {
  mint: PublicKey;
}

export const MAX_CHANGE = 4096;

export const claimExcessRentTransactionButton = async (
  { wallet, params }: IExecutorParams<IRemoveFromGroup>,
  connection: Connection
): Promise<{
  data?: ITransactionTemplate[];
  error?: any;
}> => {
  if (!wallet.publicKey) {
    throw Error("Wallet key missing");
  }

  const data: ITransactionTemplate[] = [];

  const libreplexLegacyProgram = getProgramInstanceLegacyInscriptions(
    connection,
    new LibreWallet(Keypair.generate())
  );

  const { mint } = params;

  const instructions: TransactionInstruction[] = [];

  const legacyMetadata = await getLegacyMetadataPda(mint)[0];
  const inscriptionV3 = await getInscriptionV3Pda(mint)[0];
  const inscriptionData = await getInscriptionDataPda(mint)[0];
  const legacyInscription = await getLegacyInscriptionPda(mint);

  const instruction = await libreplexLegacyProgram.methods
    .claimExcessRentAsUauth()
    .accounts({
      authority: wallet.publicKey,
      payer: wallet.publicKey,
      mint,
      legacyMetadata,
      inscriptionV3,
      inscriptionData,
      legacyInscription,
      systemProgram: SystemProgram.programId,
      inscriptionsProgram: PROGRAM_ID_INSCRIPTIONS,
    })
    .instruction();
  instructions.push(instruction);

  const blockhash = await connection.getLatestBlockhash();

  data.push({
    instructions,
    description: `Claim excess rent`,
    signers: [],
    blockhash,
  });

  console.log({ data });

  return {
    data,
  };
};

export const ClaimExcessRentTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IRemoveFromGroup>,
    "transactionGenerator"
  >
) => {
  const { data: inscriptionData } = useInscriptionDataForRoot(
    props.params.mint
  );
  const { inscription } = useInscriptionV3ForRoot(props.params.mint);

  const minimumBalanceForRent = useMemo(
    () =>
      inscription?.data?.item.size
        ? getRentFromDataLength(inscription.data.item.size) * 1_000_000_000
        : undefined,
    [inscription?.data?.item.size]
  );

  const targetLamports = useMemo(
    () => (inscription.data ? minimumBalanceForRent : 0),
    [inscription]
  );

  useEffect(() => {
    console.log({
      inscriptionSize: inscription?.data?.item.size,
      minimumBalanceForRent,
    });
  }, [inscription, minimumBalanceForRent]);

  const { connection } = useConnection();
  const metadata = useLegacyMetadataByMintId(props.params.mint, connection);

  const lamportDiff = useMemo(() => {
    return inscriptionData?.item && targetLamports
      ? Number(inscriptionData.item.balance) -
          Math.max(targetLamports, 0)
      : 0;
  }, [inscriptionData, inscription]);

  const solDiff = useMemo(() => lamportDiff / 1_000_000_000, [lamportDiff]);

  const { publicKey } = useWallet();

  const amIUauth = useMemo(
    () =>
      publicKey &&
      metadata?.data?.item &&
      publicKey?.equals(metadata.data.item.updateAuthority),
    [publicKey, metadata]
  );

  const isImmutable = useMemo(
    () => inscription?.data?.item?.authority.equals(SystemProgram.programId),
    [inscription]
  );

  return amIUauth ? (
    <>
      {solDiff > 0.000001 ? (
        isImmutable ? (
          <Text>Immutable. Cannot claim rent</Text>
        ) : (
          <GenericTransactionButton<IRemoveFromGroup>
            text={`Claim Excess Rent (${solDiff.toFixed(3)})`}
            transactionGenerator={claimExcessRentTransactionButton}
            onError={(msg) => notify({ message: msg })}
            {...props}
          />
        )
      ) : (
        <Text>No rent to reclaim</Text>
      )}
    </>
  ) : (
    <>
      {metadata.data && (
        <HStack>
          <Text>Update auth</Text>
          <CopyPublicKeyButton
            publicKey={metadata.data.item.updateAuthority.toBase58()}
          />
        </HStack>
      )}
    </>
  );
};
