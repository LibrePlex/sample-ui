import { NEXT_PUBLIC_SHDW_ACCOUNT } from "@app/environmentvariables";
import { IdlTypes } from "@coral-xyz/anchor";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  AttributeType, GenericTransactionButton,
  GenericTransactionButtonProps, IExecutorParams, ITransactionTemplate, getProgramInstanceMetadata
} from  "@libreplex/shared-ui";

import {getGroupPda, getPermissionsPda, notify } from  "@libreplex/shared-ui";

import { LibreplexMetadata } from "@libreplex/idls/lib/types/libreplex_metadata";
import React from "react";

export type CollectionInput = IdlTypes<LibreplexMetadata>["CollectionInput"];

export interface ICreateCollection {
  name: string;
  symbol: string;
  description: string;
  attributeTypes: AttributeType[];
  royalties: CollectionInput["royalties"];
  permittedSigners: CollectionInput["permittedSigners"];
  metadataProgramId: PublicKey;
}

export const createCollection = async (
  { wallet, params }: IExecutorParams<ICreateCollection>,
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

  const seed = Keypair.generate();

  const [collection] = getGroupPda(seed.publicKey);

  const [permissions] = getPermissionsPda(collection, wallet.publicKey);

  const {
    symbol,
    name,
    permittedSigners,
    attributeTypes,
    description,
    royalties,
    metadataProgramId,
  } = params;

  const librePlexProgram = getProgramInstanceMetadata(
    metadataProgramId,
    connection,
    wallet
  );

  /// for convenience we are hardcoding the urls to predictable shadow drive ones for now.
  /// anything could be passed in obviously. !WE ASSUME PNG FOR NOW!

  const url = `https://shdw-drive.genesysgo.net/${NEXT_PUBLIC_SHDW_ACCOUNT}/${collection.toBase58()}.png`;

  console.log({
    authority: wallet.publicKey.toBase58(),
    permissions: permissions.toBase58(),
    collection: collection.toBase58(),
    seed: seed.publicKey.toBase58(),
    systemProgram: SystemProgram.programId.toBase58(),
  });

  const instruction = await librePlexProgram.methods
    .createCollection({
      name,
      symbol,
      description,
      attributeTypes,
      royalties,
      permittedSigners,
      url,
    })
    .accounts({
      authority: wallet.publicKey,
      collection,
      seed: seed.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
  console.log("INSTRUCTION CREATED");
  let instructions: TransactionInstruction[] = [];
  instructions.push(instruction);
  data.push({
    instructions,
    description: `Create collection`,
    signers: [],
  });

  console.log({ data });

  return {
    data,
  };
};

export const CreateCollectionTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<ICreateCollection>,
    "transactionGenerator"
  >
) => {
  return (
    <>
      <GenericTransactionButton<ICreateCollection>
        text={"Create collection"}
        transactionGenerator={createCollection}
        onError={(msg) => notify({ message: msg ?? "N/A" })}
        {...props}
      />
    </>
  );
};
