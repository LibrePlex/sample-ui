import {
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
  SystemProgram,
} from "@solana/web3.js";
import BN from "bn.js";
import React from "react";
import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
  IExecutorParams,
  ITransactionTemplate,
  Listing,
  PROGRAM_ID_METADATA,
  Price,
  getListingPda,
  getMetadataPda,
  getProgramInstanceShop,
} from  "@libreplex/shared-ui";

import { notify } from  "@libreplex/shared-ui";

// export enum AssetType {
//   Image,
//   Inscription,
// }

export interface IListMint {
  price: Price;
  mint: PublicKey;
  tokenAccount: PublicKey;
  amount: BigInt;
}

// start at 0. We can extend as needed
export const ORDINAL_DEFAULT_LENGTH = 0;

export const listMint = async (
  { wallet, params }: IExecutorParams<IListMint>,
  connection: Connection
): Promise<{
  data?: ITransactionTemplate[];
  error?: any;
}> => {
  const data: {
    instructions: TransactionInstruction[];
    signers: Keypair[];
    description: string;
  }[] = [];

  const librePlexProgram = getProgramInstanceShop(connection, wallet);

  if (!librePlexProgram) {
    throw Error("IDL not ready");
  }

  const { price, mint, tokenAccount } = params;

  /// for convenience we are hardcoding the urls to predictable shadow drive ones for now.
  /// anything could be passed in obviously. !WE ASSUME PNG FOR NOW!

  let instructions: TransactionInstruction[] = [];

  let priceInput = price.native?.lamports
    ? {
        native: {
          lamports: price.native.lamports,
        },
      } 
    : price.spl
    ? {
        spl: {
          mint: price.spl.mint,
          amount: price.spl.amount,
        },
      }
    : null;

  if (!priceInput) {
    throw Error("Unexpected price type");
  }

  const [metadata] = getMetadataPda(
    new PublicKey(PROGRAM_ID_METADATA),
    new PublicKey(mint)
  );

  const [listing, listingBump] = getListingPda(mint);

  const escrowTokenAccount = getAssociatedTokenAddressSync(
    mint,
    listing,
    true,
    TOKEN_2022_PROGRAM_ID
  );

  const instruction = await librePlexProgram.methods
    .list({
      // native / spl etc
      price: priceInput as any,
      amount: new BN(1), // for NFTs the amount is always 1
      listingBump,
    })
    .accounts({
      lister: wallet.publicKey,
      mint,
      metadata,
      listing,
      escrowTokenAccount,
      listerTokenAccount: tokenAccount,
      // usual solana gubbins
      systemProgram: SystemProgram.programId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,

      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .instruction();
  instructions.push(instruction);

  data.push({
    instructions,
    description: `List mint`,
    signers: [],
  });

  console.log({ data });

  return {
    data,
  };
};

export const ListMintTransactionButton = (
  props: Omit<GenericTransactionButtonProps<IListMint>, "transactionGenerator">
) => {
  return (
    <GenericTransactionButton<IListMint>
      text={"List"}
      transactionGenerator={listMint}
      onError={(msg) => notify({ message: msg ?? "Unknown error" })}
      {...props}
    />
  );
};
