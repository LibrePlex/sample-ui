import {
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
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
  IRpcObject,
  ITransactionTemplate,
  getProgramInstanceShop,
} from  "@libreplex/shared-ui";


import {  notify } from  "@libreplex/shared-ui";
import { IdlAccounts } from "@coral-xyz/anchor";
import {LibreplexShop} from "@libreplex/idls/lib/cjs/libreplex_shop"

type Listing = IdlAccounts<LibreplexShop>["listing"];

export enum AssetType {
  Image,
  Inscription,
}

export interface IExecuteTrade {
  listing: IRpcObject<Listing>;
}

export const delist = async (
  { wallet, params }: IExecutorParams<IExecuteTrade>,
  connection: Connection
): Promise<{
  data?: ITransactionTemplate[];
  error?: any;
}> => {
  const data: ITransactionTemplate[] = [];

  const librePlexProgram = getProgramInstanceShop(connection, wallet);

  if (!librePlexProgram) {
    throw Error("IDL not ready");
  }
  const { listing } = params;

  /// for convenience we are hardcoding the urls to predictable shadow drive ones for now.
  /// anything could be passed in obviously. !WE ASSUME PNG FOR NOW!

  let instructions: TransactionInstruction[] = [];

  const blockhash = await connection.getLatestBlockhash();

  const escrowTokenAccount = getAssociatedTokenAddressSync(
    (listing.item as any).mint,
    listing.pubkey,
    true,
    TOKEN_2022_PROGRAM_ID
  );

  // const listerPaymentTokenAccount = getAssociatedTokenAddressSync(
  //   listing.item.mint,
  //   listing.item.lister,
  //   true,
  //   TOKEN_2022_PROGRAM_ID
  // );

  const listerTokenAccount = getAssociatedTokenAddressSync(
    (listing.item as any).mint,
    wallet.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID
  );

  const instruction = await librePlexProgram.methods
    .delist()
    .accounts({
      lister: (listing.item as any).lister,
      mint: (listing.item as any).mint,
      listing: listing.pubkey,
      escrowTokenAccount,
      listerTokenAccount,
      // usual solana gubbins
      systemProgram: SystemProgram.programId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenProgram2022: TOKEN_2022_PROGRAM_ID
    })
    .instruction();
  instructions.push(instruction);

  data.push({
    instructions,
    description: `Delist`,
    signers: [],
    blockhash
  });

  console.log({ data });

  return {
    data,
  };
};

export const DelistTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IExecuteTrade>,
    "transactionGenerator"
  >
) => {
  return (
    <GenericTransactionButton<IExecuteTrade>
      text={"Delist"}
      transactionGenerator={delist}
      onError={(msg) => notify({ message: msg ?? "Unknown error" })}
      {...props}
    />
  );
};
