import { Text } from "@chakra-ui/react";
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
import { createDeleteCollectionInstruction } from "generated/libreplex";

import { getCollectionPda } from "pdas/getCollectionPda";
import { getUserPermissionsPda } from "pdas/getUserPermissionsPda";
import { useState } from "react";

export interface INftCollectionData {
  royaltyBps: number;
  royaltyShares: {
    recipient: PublicKey;
    share: number;
  }[];
  permittedSigners;
}

export interface IDeleteCollection {
  collection: PublicKey;
  collectionPermissions: PublicKey;
}

export const deleteCollection = async (
  { wallet, params }: IExecutorParams<IDeleteCollection>,
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

  // const a = createDeleteCollectionInstruction({
  //   authority: wallet.publicKey,
  //       collectionData: collectionPda,
  //       collectionSeed: seed.publicKey,
  //       receiver: wallet.publicKey,
  //       systemProgram: SystemProgram.programId,
  // }, {
  //   bumpCollectionData: 1
  // })

  // console.log({a});

  // const librePlexProgram = getProgramInstance(connection, {
  //   ...wallet,
  //   payer: Keypair.generate(),
  // });

  const { collection, collectionPermissions } = params;

  const instruction = createDeleteCollectionInstruction({
    signer: wallet.publicKey,
    signerCollectionPermissions: collectionPermissions,
    collection,
    receiver: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  });

  // const instruction = await librePlexProgram.methods
  //   .createCollection({
  //     name,
  //     symbol,
  //     collectionUrl,
  //     nftCollectionData: params.nftCollectionData,
  //   })
  //   .accounts({
  //     authority: wallet.publicKey,
  //     userPermissions,
  //     collection,
  //     seed: seed.publicKey,
  //     systemProgram: SystemProgram.programId,
  //   })
  //   .instruction();

  let instructions: TransactionInstruction[] = [];
  instructions.push(instruction);
  data.push({
    instructions,
    description: `Delete collection`,
    signers: [],
  });

  console.log({ data });

  return {
    data,
  };
};

export const DeleteCollectionTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IDeleteCollection>,
    "transactionGenerator"
  >
) => {
  const [deleted, setDeleted] = useState<boolean>(false);
  return (
    <>
      <GenericTransactionButton<IDeleteCollection>
        onSuccess={(msg) => {
          setDeleted(true);
        }}
        
        disabled={deleted}
        text={"Delete"}
        transactionGenerator={deleteCollection}
        {...props}
      />
    </>
  );
};
