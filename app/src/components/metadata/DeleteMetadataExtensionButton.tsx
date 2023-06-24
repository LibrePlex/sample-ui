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


export interface IDeleteMetadata {
  group: PublicKey;
  metadataExtension: PublicKey,
  collectionPermissions: PublicKey;
}

export const deleteMetadata = async (
  { wallet, params }: IExecutorParams<IDeleteMetadata[]>,
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



  for (const metadataToDelete of params) {
    const { group, collectionPermissions, metadataExtension: metadata } = metadataToDelete;


    const instruction = await librePlexProgram.methods
    .deleteMetadataExtension()
    .accounts({
      updateAuthority: wallet.publicKey,
      metadataExtension: metadata,
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
      description: `Delete metadata`,
      signers: [],
    });

    console.log({ data });
  }
  return {
    data,
  };
};

export const DeleteMetadataExtensionButton = (
  props: Omit<
    GenericTransactionButtonProps<IDeleteMetadata[]>,
    "transactionGenerator"
  >
) => {
  const { addDeletedKey } = useDeletedKeysStore();

  return (
    <>
      <GenericTransactionButton<IDeleteMetadata[]>
        text={`Delete (${props.params.length})` }
        transactionGenerator={deleteMetadata}
        {...props}
        onSuccess={(msg) => {
          for( const collection of props.params) {
            addDeletedKey(collection.group);
          }
          props.onSuccess && props.onSuccess(msg);
        }}
      />
    </>
  );
};
