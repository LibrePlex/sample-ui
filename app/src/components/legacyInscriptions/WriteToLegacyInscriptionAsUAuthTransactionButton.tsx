import {
  EncodingType,
  GenericTransactionButton,
  GenericTransactionButtonProps,
  IExecutorParams,
  ITransactionTemplate,
  MediaType,
  PROGRAM_ID_INSCRIPTIONS,
  ScannerLink,
  getInscriptionDataPda,
  getInscriptionPda,
  getInscriptionV3Pda,
  getLegacyMetadataPda,
  useInscriptionById,
  useInscriptionDataForRoot,
} from "@libreplex/shared-ui";
import { RefetchButton } from "../RefetchButton";
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";

import { HStack, Heading, Progress, Text, VStack } from "@chakra-ui/react";
import { notify } from "@libreplex/shared-ui";
import { AccountLayout } from "@solana/spl-token";
import { useMemo } from "react";
import { getProgramInstanceLegacyInscriptions } from "@libreplex/shared-ui";
import { getLegacyInscriptionPda } from "@libreplex/shared-ui";
import {
  BATCH_SIZE,
  useInscriptionWriteStatus,
} from "../inscriptions/WriteToInscriptionTransactionButton";
import React from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useInscriptionChunks } from "../inscriptions/useInscriptionChunks";
import { useInscriptionV3ById } from "@libreplex/shared-ui/src/sdk/query/inscriptions/inscriptionsV3";

export interface IWriteToLegacyInscriptionAsUAuth {
  mint: PublicKey;
  dataBytes: number[];
  mediaType: string;
  encodingType: string;
}

export const writeToLegacyInscriptionAsUauth = async (
  {
    wallet,
    params,
  }: IExecutorParams<
    IWriteToLegacyInscriptionAsUAuth & {
      chunks: { chunk: number[]; isValid: boolean }[];
    }
  >,
  connection: Connection,
  cluster: string
): Promise<{
  data?: ITransactionTemplate[];
  error?: any;
}> => {
  const data: ITransactionTemplate[] = [];

  const legacyInscriptionsProgram = getProgramInstanceLegacyInscriptions(
    connection,
    wallet
  );

  if (!legacyInscriptionsProgram) {
    throw Error("IDL not ready");
  }

  // have to check the owner here - unfortunate as it's expensive
  const { mint, dataBytes, mediaType, encodingType, chunks } = params;

  const inscription = getInscriptionPda(mint)[0];
  const inscriptionV2 = getInscriptionV3Pda(mint)[0];

  const inscriptionData = getInscriptionDataPda(mint)[0];
  const legacyInscription = getLegacyInscriptionPda(mint);
  const legacyMetadata = getLegacyMetadataPda(mint)[0];

  let startPos = 0;
  const blockhash = await connection.getLatestBlockhash();
  const remainingBytes = [...dataBytes];
  // one empty instruction that sets the mediatype and the encoding type
  console.log({ mediaType, encodingType });
  let i = 0;
  while (remainingBytes.length > 0) {
    if (!chunks[i].isValid) {
      const instructions: TransactionInstruction[] = [];

      // reduce the first batch size a bit since we're passing media type and
      // encoding type
      const byteBatch = chunks[i].chunk;
      console.log({ byteBatch, startPos, mediaType, encodingType });
      instructions.push(
        await legacyInscriptionsProgram.methods
          .writeToLegacyInscriptionAsUauth({
            data: Buffer.from(byteBatch),
            startPos,
            // always write these in case some transactions do not go through
            mediaType: mediaType,
            encodingType: encodingType,
          })
          .accounts({
            authority: wallet.publicKey,
            mint,
            inscription,
            inscriptionV2,
            inscriptionData,
            legacyInscription,
            legacyMetadata,
            systemProgram: SystemProgram.programId,
            inscriptionsProgram: PROGRAM_ID_INSCRIPTIONS,
          })
          .instruction()
      );
     
      data.push({
        instructions,
        signers: [],
        signatures: [],
        description: "Resize legacy inscription",
        blockhash,
      });
    }
    startPos += BATCH_SIZE;
    i++;
    // 20 transactions max in one go
    if (data.length === 25) {
      break;
    }
  }

  return {
    data,
  };
};

export const WriteToLegacyInscriptionAsUAuthTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IWriteToLegacyInscriptionAsUAuth>,
    "transactionGenerator"
  >
) => {
  const inscriptionId = useMemo(
    () => getInscriptionV3Pda(props.params.mint),
    [props]
  )[0];

  const { connection } = useConnection();
  const { data: inscription } = useInscriptionV3ById(inscriptionId, connection);

  const { chunks, refetch } = useInscriptionChunks(
    props.params.mint,
    props.params.dataBytes
  );

  const chunksToWrite = useMemo(
    () => chunks.reduce((a, b) => a + (b.isValid ? 0 : 1), 0),
    [chunks]
  );
  const chunksToWriteIndices = useMemo(
    () =>
      chunks
        .map((item, idx) => ({ item, idx }))
        .filter((item) => !item.item.isValid)
        .map((item) => item.idx)
        .slice(0, 10).join(','),
    [chunks]
  );
  const { writeStates, expectedCount } = useInscriptionWriteStatus(
    props.params.dataBytes,
    inscriptionId
  );
  return (
    <VStack gap={2}>
      {writeStates === expectedCount ? (
        <VStack>
          <Heading size="lg">Inscribed</Heading>
          <HStack>
            <Text>View on LibreScanner</Text>
            <ScannerLink mintId={props.params.mint} />
          </HStack>
        </VStack>
      ) : (
        <GenericTransactionButton<
          IWriteToLegacyInscriptionAsUAuth & {
            chunks: { chunk: number[]; isValid: boolean }[];
          }
        >
          text={`INSCRIBE NOW!`}
          transactionGenerator={writeToLegacyInscriptionAsUauth}
          onError={(msg) => notify({ message: msg ?? "Unknown error" })}
          size="lg"
          {...{
            ...props,
            params: { ...props.params, chunks },
            disableSuccess: true,
          }}
          formatting={{ colorScheme: "red" }}
        />
      )}
      <Text>Chunks to write: {chunksToWriteIndices}</Text>
      <RefetchButton refetch={refetch} />
      {writeStates !== expectedCount && (
        <div style={{ width: "100%" }}>
          <Progress
            size="xs"
            colorScheme="pink"
            value={(writeStates / expectedCount) * 100}
          />
        </div>
      )}
    </VStack>
  );
};
