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
// import { usePermissionsHydratedWithCollections } from "stores/accounts/useCollectionsById";


export interface IDeleteCollection {
  collection: PublicKey;
  creator: PublicKey; // the creator of the collection (close account rent gets sent here)
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

  const librePlexProgram = getProgramInstance(connection, {
    ...wallet,
    payer: Keypair.generate(),
  });



  for (const collectionToDelete of params) {
    const { collection, collectionPermissions, creator } = collectionToDelete;


    const instruction = await librePlexProgram.methods
    .deleteGroup({admin: {}})
    .accounts({
      signer: wallet.publicKey,
      permissions: collectionPermissions,
      collection,
      creator,
      receiver: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

    // const instruction = createDeleteCollectionInstruction({
    //   signer: wallet.publicKey,
    //   signerCollectionPermissions: collectionPermissions,
    //   collection,
    //   creator,
    //   receiver: wallet.publicKey,
    //   systemProgram: SystemProgram.programId,
    // });

    let instructions: TransactionInstruction[] = [];
    instructions.push(instruction);
    data.push({
      instructions,
      description: `Delete collection`,
      signers: [],
    });

    console.log({ data });
  }
  return {
    data,
  };
};

export const DeleteCollectionTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IDeleteCollection[]>,
    "transactionGenerator"
  >
) => {
  const { addDeletedKey } = useDeletedKeysStore();

  return (
    <>
      <GenericTransactionButton<IDeleteCollection[]>
        text={`Delete (${props.params.length})` }
        transactionGenerator={deleteCollection}
        {...props}
        onSuccess={(msg) => {
          for( const collection of props.params) {
            addDeletedKey(collection.collection);
          }
          props.onSuccess && props.onSuccess(msg);
        }}
      />
    </>
  );
};
