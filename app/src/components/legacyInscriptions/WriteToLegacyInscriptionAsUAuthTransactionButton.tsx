import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";

import { AccountLayout } from "@solana/spl-token";
import { useMemo } from "react";
import React from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
  IExecutorParams,
  ITransactionTemplate,
  PROGRAM_ID_INSCRIPTIONS,
  getInscriptionDataPda,
  getInscriptionPda,
  getInscriptionV3Pda,
  getLegacyInscriptionPda,
  getLegacyMetadataPda,
  getProgramInstanceLegacyInscriptions,
  notify,
} from "@libreplex/shared-ui";
import { useInscriptionWriteStatus } from "../inscriptions/WriteToInscriptionTransactionButton";
import { Box, Button, Text } from "@chakra-ui/react";
import {useInscriptionChunks} from "../inscriptions/useInscriptionChunks"

export interface IWriteToLegacyInscriptionAsUAuth {
  mint: PublicKey;
  mediaType: string;
  encodingType: string;
}

export const BATCH_SIZE = 700;

export const writeToLegacyInscriptionAsUauth = async (
  {
    wallet,
    params,
  }: IExecutorParams<
    IWriteToLegacyInscriptionAsUAuth & {
      chunks: { chunk: number[]; isValid: boolean }[];
    }
  >,
  connection: Connection
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
  const { mint, mediaType, encodingType, chunks } = params;

  const inscription = getInscriptionPda(mint)[0];
  const inscriptionV2 = getInscriptionV3Pda(mint)[0];

  const inscriptionData = getInscriptionDataPda(mint)[0];
  const legacyInscription = getLegacyInscriptionPda(mint);
  const legacyMetadata = getLegacyMetadataPda(mint)[0];

  // one empty instruction that sets the mediatype and the encoding type
  console.log({ mediaType, encodingType, chunks });
  let i = 0;

  while (i < chunks.length) {
    if (!chunks[i].isValid) {
      const instructions: TransactionInstruction[] = [];

      // reduce the first batch size a bit since we're passing media type and
      // encoding type
      const byteBatch = chunks[i].chunk;
      instructions.push(
        await legacyInscriptionsProgram.methods
          .writeToLegacyInscriptionAsUauth({
            data: Buffer.from(byteBatch),
            startPos: BATCH_SIZE * i,
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
        instructions: [...instructions],
        signers: [],
        signatures: [],
        description: "Resize legacy inscription",
        blockhash: undefined,
      });
      // if( instructions.length > 1) {
      //   break;
      // }
    }

    // if (instructions.length === 25) {

    //   instructions.length = 0;
    // }
    i++;
  }

  // console.log({instructions});
  // if (instructions.length > 0 ) {
  //   data.push({
  //     instructions: instructions.splice(0),
  //     signers: [],
  //     signatures: [],
  //     description: "Resize legacy inscription",
  //     blockhash: undefined, // forces blockhash to be generator in executor
  //   });
  // }

  return {
    data,
  };
};

export const WriteToLegacyInscriptionAsUAuthTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<
      IWriteToLegacyInscriptionAsUAuth & { dataBytes: number[] }
    >,
    "transactionGenerator"
  >
) => {
  const inscriptionId = useMemo(
    () => getInscriptionV3Pda(props.params.mint),
    [props]
  )[0];

  const { chunks, refetch } = useInscriptionChunks(
    props.params.mint,
    props.params.dataBytes
  );

  const chunksToWriteIndices = useMemo(
    () =>
      chunks
        .map((item, idx) => ({ item, idx }))
        .filter((item) => !item.item.isValid)
        .map((item) => item.idx)
        .join(","),
    [chunks]
  );
  const { writeStates, expectedCount } = useInscriptionWriteStatus(
    props.params.dataBytes,
    inscriptionId
  );
  return (
    <Box gap={2}>
      {writeStates === expectedCount ? (
        <Box>
          <Text>Inscribed</Text>
        </Box>
      ) : chunksToWriteIndices.length === 0 ? (
        <Text>Already inscribed ({chunks.length} written)</Text>
      ) : (
        <GenericTransactionButton<
          IWriteToLegacyInscriptionAsUAuth & {
            chunks: { chunk: number[]; isValid: boolean }[];
          }
        >
          variant="contained"
          text={`INSCRIBE NOW!`}
          transactionGenerator={writeToLegacyInscriptionAsUauth}
          onError={(msg) => notify({ message: msg ?? "Unknown error" })}
          {...{
            ...props,
            params: { ...props.params, chunks },
            disableSuccess: true,
          }}
        />
      )}
      <Text>Remaining chunks to write: {chunksToWriteIndices.length}</Text>
      <Button onClick={() => refetch()}>Refetch </Button>
    </Box>
  );
};
