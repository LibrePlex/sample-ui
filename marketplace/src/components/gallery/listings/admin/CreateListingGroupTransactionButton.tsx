
import {
  Connection,
  Keypair,
  TransactionInstruction,
  SystemProgram
} from "@solana/web3.js";
import React from "react";
import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
  IExecutorParams,
  ITransactionTemplate,
  getListingFilterPda,
  getListingGroupPda,
  getProgramInstanceShop
} from "shared-ui";

import { ListingFilterType, notify } from "shared-ui";

export enum AssetType {
  Image,
  Inscription,
}

export interface ICreateListingGroup {
  name: string;
  filterType: ListingFilterType;
}

// start at 0. We can extend as needed
export const ORDINAL_DEFAULT_LENGTH = 0;

export const createListingGroup = async (
  { wallet, params }: IExecutorParams<ICreateListingGroup>,
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

  const { name, filterType } = params;

  console.log("Creating instruction");
  let instructions: TransactionInstruction[] = [];

  if (filterType.group) {
    const seed = Keypair.generate().publicKey;

    const [listingGroup] = getListingGroupPda(wallet.publicKey, seed);
    const [listingFilter] = getListingFilterPda(wallet.publicKey, seed);
    const instruction = await librePlexProgram.methods
      .createListingGroup({
        name,
        seed,
      })
      .accounts({
        admin: wallet.publicKey,
        listingGroup,
        systemProgram: SystemProgram.programId
      })
      .instruction();


    instructions.push(instruction);

    instructions.push(
      await librePlexProgram.methods.createListingFilter({
        seed,
        filterType
      }).accounts({
        admin: wallet.publicKey,
        listingFilter,
        listingGroup,
        systemProgram: SystemProgram.programId
      }).instruction()
    )
  } else {
    throw Error("Unsupported listing group type");
  }
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

export const CreateListingGroupTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<ICreateListingGroup>,
    "transactionGenerator"
  >
) => {
  return (
    <>
      <GenericTransactionButton<ICreateListingGroup>
        text={"Create listing group"}
        transactionGenerator={createListingGroup}
        onError={(msg) => notify({ message: msg ?? 'N/A' })}
        {...props}
      />
    </>
  );
};
