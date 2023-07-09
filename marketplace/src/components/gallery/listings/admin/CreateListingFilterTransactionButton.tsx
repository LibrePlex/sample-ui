
import {
  Connection,
  Keypair,
  TransactionInstruction,
  SystemProgram,
  PublicKey
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

export interface ICreateListingFilter {
  listingGroup: PublicKey,
  group: PublicKey,
  filterType: ListingFilterType;
}

// start at 0. We can extend as needed
export const ORDINAL_DEFAULT_LENGTH = 0;

export const createListingFilter = async (
  { wallet, params }: IExecutorParams<ICreateListingFilter>,
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

  const { group, filterType, listingGroup } = params;

  console.log("Creating instruction");
  let instructions: TransactionInstruction[] = [];

  if (filterType.group) {
    const seed = Keypair.generate().publicKey;

    const [listingFilter] = getListingFilterPda(wallet.publicKey, seed);
    const instruction = await librePlexProgram.methods
      .createListingFilter({
        seed,
        filterType: {
          group: {
            pubkey: group
          }
        }
      })
      .accounts({
        admin: wallet.publicKey,
        listingFilter,
        listingGroup,
        systemProgram: SystemProgram.programId
      })
      .instruction();
    instructions.push(instruction);
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
    GenericTransactionButtonProps<ICreateListingFilter>,
    "transactionGenerator"
  >
) => {
  return (
    <>
      <GenericTransactionButton<ICreateListingFilter>
        text={"Create listing filter"}
        transactionGenerator={createListingFilter}
        onError={(msg) => notify({ message: msg ?? 'N/A' })}
        {...props}
      />
    </>
  );
};
