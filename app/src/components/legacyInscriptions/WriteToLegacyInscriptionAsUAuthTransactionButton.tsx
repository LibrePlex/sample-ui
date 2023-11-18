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
} from "@libreplex/shared-ui";
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


export interface IWriteToLegacyInscriptionAsUAuth {
  mint: PublicKey;
  dataBytes: number[];
  mediaType: string;
  encodingType: string;
}

export const writeToLegacyInscriptionAsUauth = async (
  { wallet, params }: IExecutorParams<IWriteToLegacyInscriptionAsUAuth>,
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
  const { mint, dataBytes, mediaType, encodingType } = params;

  const tokenAccounts = await connection.getTokenLargestAccounts(mint);

  let owner: PublicKey;
  let tokenAccount: PublicKey;

  for (const ta of tokenAccounts.value) {
    if (BigInt(ta.amount) > BigInt(0)) {
      tokenAccount = ta.address;
    }
  }

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
  let isFirst = true;
  while (remainingBytes.length > 0) {
    const instructions: TransactionInstruction[] = [];

    // reduce the first batch size a bit since we're passing media type and
    // encoding type
    const byteBatch = remainingBytes.splice(0, BATCH_SIZE);
    console.log({byteBatch, startPos, mediaType, encodingType});
    instructions.push(
      await legacyInscriptionsProgram.methods
        .writeToLegacyInscriptionAsUauth({
          data: Buffer.from(byteBatch),
          startPos,
          // always write these in case some transactions do not go through
          mediaType: mediaType, 
          encodingType: encodingType
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
    startPos += BATCH_SIZE;
    data.push({
      instructions,
      signers: [],
      signatures: [],
      description: "Resize legacy inscription",
      blockhash,
    });
    isFirst = false;
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
  const inscription = useMemo(
    () => getInscriptionPda(props.params.mint),
    [props]
  )[0];

  const { writeStates, expectedCount } = useInscriptionWriteStatus(
    props.params.dataBytes,
    inscription
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
        <GenericTransactionButton<IWriteToLegacyInscriptionAsUAuth>
          text={`INSCRIBE NOW!`}
          transactionGenerator={writeToLegacyInscriptionAsUauth}
          onError={(msg) => notify({ message: msg ?? "Unknown error" })}
          size="lg"
          {...props}
          formatting={{ colorScheme: "red" }}
        />
      )}
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
