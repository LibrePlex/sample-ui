import { Progress, Text } from "@chakra-ui/react";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { useCallback, useContext, useEffect, useMemo } from "react";
import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
  IExecutorParams,
  IRpcObject,
  ITransactionTemplate,
  Inscription,
  InscriptionStoreContext,
  LibreWallet,
  Metadata,
  PROGRAM_ID_METADATA,
  getProgramInstanceInscriptions,
  getProgramInstanceMetadata,
  notify,
} from "@libreplex/shared-ui";
import { useStore } from "zustand";
import React from "react";

export interface IWriteToInscription {
  inscription: IRpcObject<Inscription>;
  metadata: IRpcObject<Metadata>;
  dataType: string;
  dataBytes: number[];
}

export const BATCH_SIZE = 700;

// start at 0. We can extend as needed
export const INSCRIPTION_DEFAULT_LENGTH = 0;

export const writeToInscription = async (
  { wallet, params }: IExecutorParams<IWriteToInscription>,
  connection: Connection
): Promise<{
  data?: ITransactionTemplate[];
  error?: any;
}> => {
  if (!wallet.publicKey) {
    throw Error("Wallet key missing");
  }

  const blockhash = await connection.getLatestBlockhash();

  const data: ITransactionTemplate[] = [];

  const inscriptionsProgram = getProgramInstanceInscriptions(
    connection,
    wallet
  );

  const metadataProgram = getProgramInstanceMetadata(
    new PublicKey(PROGRAM_ID_METADATA),
    connection,
    new LibreWallet(Keypair.generate())
  );

  const { inscription, dataBytes, dataType, metadata } = params;

  const remainingBytes = [...dataBytes];
  let startPos = 0;
  data.push({
    instructions: [
      await metadataProgram.methods
        .updateInscriptionDatatype({
          dataType,
        })
        .accounts({
          editor: wallet.publicKey,
          metadata: metadata.pubkey,
          delegatedGroupWidePermissions: null,
          delegatedMetadataSpecificPermissions: null,
          collection: metadata.item.collection,
          systemProgram: SystemProgram.programId,
        })
        .instruction(),
    ],
    description: "Update inscription datatype",
    signers: [],
    blockhash,
  });

  if(!inscriptionsProgram) {
    throw Error("Inscriptions program not defined");
  }

  while (remainingBytes.length > 0) {
    console.log("BATCH CREATING", remainingBytes.length);
    const instructions: TransactionInstruction[] = [];
    const byteBatch = remainingBytes.splice(0, BATCH_SIZE);

    instructions.push(
      await inscriptionsProgram.methods
        .writeToInscription({
          data: Buffer.from(byteBatch),
          startPos,
          mediaType: 'none',
          encodingType: 'none',
        })
        .accounts({
          authority: wallet.publicKey,
          inscription: inscription.pubkey,
          systemProgram: SystemProgram.programId,
        })
        .instruction()
    );
    startPos += BATCH_SIZE;

    data.push({
      instructions,
      description: `Write to inscription`,
      signers: [],
      blockhash,
    });
  }
  console.log({ data });
  return {
    data,
  };
};

export const useInscriptionWriteStatus = (
  dataBytes: number[],
  inscription: PublicKey | undefined
) => {
  const expectedCount = useMemo(
    () => dataBytes ? Math.ceil(dataBytes.length / BATCH_SIZE) : 0,
    [dataBytes]
  );
  const store = useContext(InscriptionStoreContext);

  const resetWriteStatus = useStore(store, (s) => s.resetWriteStatus);
  const setUpdatedInscriptionData = useStore(
    store,
    (s) => s.setUpdatedInscriptionData
  );
  const updatedInscriptionData = useStore(
    store,
    (s) => s.updatedInscriptionData[inscription?.toBase58()??'']
  );
  const writeStates = useStore(
    store,
    (s) => s.writeStates[inscription?.toBase58()??'']
  );

  const reset = useCallback(
    () => inscription && resetWriteStatus(inscription.toBase58()),
    [resetWriteStatus, inscription]
  );

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    if (
      inscription && 
      expectedCount > 0 &&
      expectedCount === writeStates &&
      updatedInscriptionData === undefined
    ) {
      setUpdatedInscriptionData(inscription.toBase58(), Buffer.from(dataBytes));
    }
  }, [
    expectedCount,
    writeStates,
    updatedInscriptionData,
    setUpdatedInscriptionData,
    inscription,
    dataBytes,
  ]);

  return { writeStates, expectedCount, reset };
};

export const WriteToInscriptionTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IWriteToInscription>,
    "transactionGenerator"
  >
) => {
  const { writeStates, expectedCount } = useInscriptionWriteStatus(
    props.params.dataBytes,
    props.params.inscription.pubkey
  );
  return (
    <>
      <div style={{ width: "100%" }}>
        <Progress
          size="xs"
          colorScheme="pink"
          value={(writeStates / expectedCount) * 100}
        />
      </div>
      {writeStates === expectedCount ? (
        <Text p={2}>Inscribed</Text>
      ) : (
        <GenericTransactionButton<IWriteToInscription>
          text={"Write"}
          transactionGenerator={writeToInscription}
          onError={(msg) => notify({ message: msg??'N/A' })}
          {...props}
        />
      )}
    </>
  );
};
