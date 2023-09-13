import { Progress, Text } from "@chakra-ui/react";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { useContext, useEffect, useMemo } from "react";
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
} from  "@libreplex/shared-ui";
import { useStore } from "zustand";

export enum AssetType {
  Image,
  Ordinal,
}

// export type Asset = {
//   type: AssetType.Image,
// } | {
//   type: AssetType.Ordinal
// }

export interface IWriteToInscription {
  inscription: IRpcObject<Inscription>;
  metadata: IRpcObject<Metadata>;
  dataType: string;
  dataBytes: number[];
}

export const BATCH_SIZE = 924;

// start at 0. We can extend as needed
export const ORDINAL_DEFAULT_LENGTH = 0;

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

  const data: {
    instructions: TransactionInstruction[];
    signers: Keypair[];
    description: string;
  }[] = [];

  const inscriptionsProgram = getProgramInstanceInscriptions(connection, {
    ...wallet,
    payer: Keypair.generate(),
  });

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
          group: metadata.item.group,
          systemProgram: SystemProgram.programId,
        })
        .instruction(),
    ],
    description: "Update inscription datatype",
    signers: [],
  });

  while (remainingBytes.length > 0) {
    console.log("BATCH CREATING", remainingBytes.length);
    const instructions: TransactionInstruction[] = [];
    const byteBatch = remainingBytes.splice(0, BATCH_SIZE);

    instructions.push(
      await inscriptionsProgram.methods
        .writeToInscription({
          data: Buffer.from(byteBatch),
          startPos,
        })
        .accounts({
          signer: wallet.publicKey,
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
    });
  }
  console.log({ data });
  return {
    data,
  };
};

export const WriteToInscriptionTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IWriteToInscription>,
    "transactionGenerator"
  >
) => {
  const expectedCount = useMemo(
    () => Math.ceil(props.params.dataBytes.length / BATCH_SIZE),
    [props.params.dataBytes.length]
  );
  const store = useContext(InscriptionStoreContext);

  const resetWriteStatus = useStore(store, (s) => s.resetWriteStatus);
  const setUpdatedInscriptionData = useStore(
    store,
    (s) => s.setUpdatedInscriptionData
  );
  const updatedInscriptionData = useStore(
    store,
    (s) => s.updatedInscriptionData[props.params.inscription?.pubkey.toBase58()]
  );
  const writeStates = useStore(
    store,
    (s) => s.writeStates[props.params.inscription?.pubkey.toBase58()]
  );
  useEffect(() => {
    resetWriteStatus(props.params.inscription.pubkey.toBase58());
  }, [props.params.inscription.pubkey, resetWriteStatus]);

  useEffect(() => {
    if (
      expectedCount > 0 &&
      expectedCount === writeStates &&
      updatedInscriptionData === undefined
    ) {
      setUpdatedInscriptionData(
        props.params.inscription.pubkey.toBase58(),
        Buffer.from(props.params.dataBytes)
      );
    }
  }, [
    expectedCount,
    writeStates,
    updatedInscriptionData,
    setUpdatedInscriptionData,
    props.params.inscription.pubkey,
    props.params.dataBytes,
  ]);

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
          onError={(msg) => notify({ message: msg })}
          {...props}
        />
      )}
    </>
  );
};
