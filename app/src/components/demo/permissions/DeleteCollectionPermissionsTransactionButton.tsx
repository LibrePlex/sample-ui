import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { getProgramInstance } from "anchor/getProgramInstance";
import { IExecutorParams } from "components/executor/Executor";
import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
} from "components/executor/GenericTransactionButton";
import { ITransactionTemplate } from "components/executor/ITransactionTemplate";

import useDeletedKeysStore from "stores/useDeletedKeyStore";

export interface IDeleteCollection {
  collection: PublicKey;
  collectionPermissions: PublicKey;
}

export const deleteCollection = async (
  { wallet, params }: IExecutorParams<IDeleteCollection[]>,
  connection: Connection
): Promise<{
  data?: ITransactionTemplate[];
  error?: any;
}> => {
  if (!wallet.publicKey) {
    throw Error("Wallet key missing");
  }
  //  / alert('here');
  console.log({ params });

  const data: {
    instructions: TransactionInstruction[];
    signers: Keypair[];
    description: string;
  }[] = [];

  const seed = Keypair.generate();

  const librePlexProgram = getProgramInstance(connection, {
    ...wallet,
    payer: Keypair.generate(),
  });

  for (const param of params) {
    const { collectionPermissions, collection } = param;
    const instruction = await librePlexProgram.methods.deleteCollectionPermissions().accounts({
      signer: wallet.publicKey,
      signerCollectionPermissions: collectionPermissions,
      collection,
      receiver: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    }).instruction();

    let instructions: TransactionInstruction[] = [];
    instructions.push(instruction);
    data.push({
      instructions,
      description: `Delete collection permissions`,
      signers: [],
    });

    console.log({ data });
  }

  return {
    data,
  };
};

export const DeleteCollectionPermissionsTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IDeleteCollection[]>,
    "transactionGenerator"
  >
) => {
  const { addDeletedKey } = useDeletedKeysStore();

  return (
      <GenericTransactionButton<IDeleteCollection[]>
        text={`Delete (${props.params.length})`}
        transactionGenerator={deleteCollection}
        {...props}
        onSuccess={(msg) => {
          for (const p of props.params) {
            addDeletedKey(p.collectionPermissions);
          }
          props.onSuccess && props.onSuccess(msg);
        }}
      />
  );
};
