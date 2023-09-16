import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
  IExecutorParams,
  ITransactionTemplate,
  getProgramInstanceMetadata
} from "@libreplex/shared-ui";
import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction
} from "@solana/web3.js";
import React from "react";

// import { usePermissionsHydratedWithCollections } from "stores/accounts/useCollectionsById";

export interface IDeleteGroups {
  metadataProgramId: PublicKey;
  groupIds: PublicKey[];
}

export const deleteGroups = async (
  { wallet, params }: IExecutorParams<IDeleteGroups>,
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

  const { metadataProgramId, groupIds } = params;
  const librePlexProgram = getProgramInstanceMetadata(
    metadataProgramId,
    connection,
    {
      ...wallet,
    }
  );

  let instructions: TransactionInstruction[] = [];

  let instruction;
  for (const groupId of groupIds) {
    instruction = await librePlexProgram.methods
      .deleteGroup()
      .accounts({
        authority: wallet.publicKey,
        group: groupId,
      })
      .instruction();
  }

  instructions.push(instruction);
  data.push({
    instructions,
    description: `Delete group`,
    signers: [],
  });

  console.log({ data });

  return {
    data,
  };
};

export const DeleteGroupsButton = (
  props: Omit<
    GenericTransactionButtonProps<IDeleteGroups>,
    "transactionGenerator"
  >
) => {
  return (
    <>
      <GenericTransactionButton<IDeleteGroups>
        text={`Delete (${props.params.groupIds.length})`}
        transactionGenerator={deleteGroups}
        {...props}
        onSuccess={(msg) => {
          props.onSuccess && props.onSuccess(msg);
        }}
      />
    </>
  );
};
