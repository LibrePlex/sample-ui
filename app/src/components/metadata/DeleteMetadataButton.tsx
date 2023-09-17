import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { useContext } from "react";
import { IRpcObject, Metadata, MetadataProgramContext, PROGRAM_ID_INSCRIPTIONS, getProgramInstanceMetadata } from  "@libreplex/shared-ui";
import { IExecutorParams } from  "@libreplex/shared-ui";
import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
} from  "@libreplex/shared-ui";
import { ITransactionTemplate } from  "@libreplex/shared-ui";
import { useStore } from "zustand";
import React from "react";



// import { usePermissionsHydratedWithCollections } from "stores/accounts/useCollectionsById";


export interface IDeleteMetadata {
  metadataProgramId: PublicKey,
  metadataObjects: IRpcObject<Metadata>[],

}

export const deleteMetadata = async (
  { wallet, params }: IExecutorParams<IDeleteMetadata>,
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

    const {metadataProgramId, metadataObjects} = params
  const librePlexProgram = getProgramInstanceMetadata(metadataProgramId, connection, {
    ...wallet
  });


  let instructions: TransactionInstruction[] = [];

  

  let instruction;
  for (const metadata of metadataObjects) {

    if( metadata.item.collection ) {
      instructions.push(await librePlexProgram.methods.removeMetadataFromCollection()
        .accounts({groupAuthority: wallet.publicKey,
            metadata: metadata.pubkey,
            delegatedGroupWidePermissions: null,
            collection: metadata.item.collection,
            systemProgram: SystemProgram.programId
          } 
      ).instruction())
    }
    
    if( metadata.item.asset.inscription) {
      instruction = await librePlexProgram.methods
      .deleteMetadataInscription()
      .accounts({
        metadataAuthority: wallet.publicKey,
        metadata: metadata.pubkey,
        delegatedMetadataSpecificPermissions: null,
        systemProgram: SystemProgram.programId,
        inscription: metadata.item.asset.inscription.accountId,
        inscriptionsProgram: PROGRAM_ID_INSCRIPTIONS
      })
      .instruction();
    }
    else {
      instruction = await librePlexProgram?.methods
      .deleteMetadata()
      .accounts({
        metadataAuthority: wallet.publicKey,
        metadata: metadata.pubkey,
        delegatedMetadataSpecificPermissions: null,
        systemProgram: SystemProgram.programId,
      })
      .instruction();
    }

   
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
    GenericTransactionButtonProps<IDeleteMetadata>,
    "transactionGenerator"
  >
) => {

  const {store} = useContext(MetadataProgramContext)

  const addDeletedKey  = useStore(store, (state)=>state.addDeletedKey);

  return (
    <>
      <GenericTransactionButton<IDeleteMetadata>
        text={`Delete (${props.params.metadataObjects.length})` }
        transactionGenerator={deleteMetadata}
        {...props}
        onSuccess={(msg) => {
          for( const metadata of props.params.metadataObjects) {
            addDeletedKey(metadata.pubkey);
          }
          props.onSuccess && props.onSuccess(msg);
        }}
      />
    </>
  );
};
