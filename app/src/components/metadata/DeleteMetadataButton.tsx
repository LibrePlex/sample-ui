import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { getProgramInstanceMetadata } from "shared-ui";
import { IExecutorParams } from "shared-ui";
import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
} from "shared-ui";
import { ITransactionTemplate } from "shared-ui";


import {useDeletedKeyStore} from "shared-ui";
// import { usePermissionsHydratedWithCollections } from "stores/accounts/useCollectionsById";


export interface IDeleteMetadata {
  metadata: PublicKey,
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

  const librePlexProgram = getProgramInstanceMetadata(connection, {
    ...wallet,
    payer: Keypair.generate(),
  });



  for (const metadataToDelete of params) {
    const { metadata } = metadataToDelete;


    const instruction = await librePlexProgram.methods
    .deleteMetadata()
    .accounts({
      metadataAuthority: wallet.publicKey,
      metadata,
      delegatedMetadataSpecificPermissions: null,
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

export const DeleteMetadataButton = (
  props: Omit<
    GenericTransactionButtonProps<IDeleteMetadata[]>,
    "transactionGenerator"
  >
) => {
  const { addDeletedKey } = useDeletedKeyStore();

  return (
    <>
      <GenericTransactionButton<IDeleteMetadata[]>
        text={`Delete (${props.params.length})` }
        transactionGenerator={deleteMetadata}
        {...props}
        onSuccess={(msg) => {
          for( const metadata of props.params) {
            addDeletedKey(metadata.metadata);
          }
          props.onSuccess && props.onSuccess(msg);
        }}
      />
    </>
  );
};
