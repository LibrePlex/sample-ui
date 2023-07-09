import {
  Connection,
  Keypair,
  TransactionInstruction,
  SystemProgram,
  PublicKey,
} from "@solana/web3.js";
import React from "react";
import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
  IExecutorParams,
  ITransactionTemplate,
  getListingFilterPda,
  getListingGroupPda,
  getProgramInstanceShop,
} from "shared-ui";

import { ListingFilterType, notify } from "shared-ui";

export enum AssetType {
  Image,
  Inscription,
}

export interface IDeleteListingFilter {
  listingFilter: PublicKey;
  listingGroup: PublicKey;
}

// start at 0. We can extend as needed
export const ORDINAL_DEFAULT_LENGTH = 0;

export const deleteListingFilter = async (
  { wallet, params }: IExecutorParams<IDeleteListingFilter>,
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

  const librePlexProgram = getProgramInstanceShop(connection, wallet);

  if (!librePlexProgram) {
    throw Error("Program not loaded. Cannot continue.");
  }

  const { listingFilter, listingGroup } = params;

  console.log("Creating instruction");
  let instructions: TransactionInstruction[] = [];

  const seed = Keypair.generate().publicKey;

  const instruction = await librePlexProgram.methods
    .deleteListingFilter()
    .accounts({
      listingFilter,
      listingGroup,
      admin: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  instructions.push(instruction);

  data.push({
    instructions,
    description: `Create listing group`,
    signers: [],
  });

  console.log({ data });

  return {
    data,
  };
};

export const DeleteListingFilterTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IDeleteListingFilter>,
    "transactionGenerator"
  >
) => {
  return (
    <>
      <GenericTransactionButton<IDeleteListingFilter>
        text={"Delete"}
        transactionGenerator={deleteListingFilter}
        onError={(msg) => notify({ message: msg ?? "N/A" })}
        {...props}
      />
    </>
  );
};
