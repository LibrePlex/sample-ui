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
  getLegacyMetadataPda,
} from "@libreplex/shared-ui";
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";

import { NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID } from "@app/environmentvariables";
import { HStack, Heading, Progress, Text, VStack } from "@chakra-ui/react";
import { notify } from "@libreplex/shared-ui";
import { AccountLayout } from "@solana/spl-token";
import { useMemo } from "react";
import { getProgramInstanceLegacyInscriptions } from "shared-ui/src/anchor/legacyInscriptions/getProgramInstanceLegacyInscriptions";
import { getLegacyInscriptionPda } from "shared-ui/src/pdas/getLegacyInscriptionPda";
import {
  BATCH_SIZE,
  useInscriptionWriteStatus,
} from "../inscriptions/WriteToInscriptionTransactionButton";

export interface IWriteToLegacyInscriptionAsUAuth {
  mint: PublicKey;
  dataBytes: number[];
  mediaType: MediaType;
  encodingType: EncodingType;
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
    new PublicKey(NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID),
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

  if (!tokenAccount) {
    throw Error("Token account not found for mint");
  }

  const tokenAccountData = await connection.getAccountInfo(tokenAccount);

  const tokenAccountObj = AccountLayout.decode(tokenAccountData.data);

  owner = tokenAccountObj.owner;

  const inscription = getInscriptionPda(mint)[0];

  const inscriptionData = getInscriptionDataPda(mint)[0];
  const legacyInscription = getLegacyInscriptionPda(mint)[0];
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

    instructions.push(
      await legacyInscriptionsProgram.methods
        .writeToLegacyInscriptionAsUauth({
          data: Buffer.from(byteBatch),
          startPos,
          mediaType: isFirst ? mediaType : null, // not setting these as it's been already set above
          encodingType: isFirst ? encodingType : null, // not setting this as it's been already set above
        })
        .accounts({
          authority: wallet.publicKey,
          mint,
          inscription,
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
