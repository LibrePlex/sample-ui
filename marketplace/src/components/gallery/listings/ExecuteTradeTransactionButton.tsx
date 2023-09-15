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
import React, { useMemo } from "react";
import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
  Group,
  IExecutorParams,
  IRpcObject,
  ITransactionTemplate,
  Metadata,
  getProgramInstanceShop,
} from  "@libreplex/shared-ui";


import { Price, notify } from  "@libreplex/shared-ui";
import { Listing } from "./groups/GroupDisplay";

export enum AssetType {
  Image,
  Inscription,
}

export interface IAccountDefinition {
  pubkey: PublicKey;
  isWritable: boolean;
  isSigner: boolean;
}

export interface IExecuteTrade {
  listing: IRpcObject<Listing>;
  metadata: IRpcObject<Metadata>;
  group: IRpcObject<Group | null>|null;
  mint: PublicKey;
  buyerPaymentTokenAccount?: PublicKey | null; // null for native
  amount: BigInt;
}

// start at 0. We can extend as needed
export const ORDINAL_DEFAULT_LENGTH = 0;

export const executeTrade = async (
  { wallet, params }: IExecutorParams<IExecuteTrade>,
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
  const { listing, metadata, mint, group, buyerPaymentTokenAccount } = params;

  if ((listing.item as any).price.spl && !buyerPaymentTokenAccount) {
    throw Error(
      "To buy a listing with SPL token, you must specify a token account"
    );
  }

  /// for convenience we are hardcoding the urls to predictable shadow drive ones for now.
  /// anything could be passed in obviously. !WE ASSUME PNG FOR NOW!

  let instructions: TransactionInstruction[] = [];

  const escrowTokenAccount = getAssociatedTokenAddressSync(
    mint,
    listing.pubkey,
    true,
    TOKEN_2022_PROGRAM_ID
  );

  const listerPaymentTokenAccount = getAssociatedTokenAddressSync(
    mint,
    (listing.item as any).lister,
    true,
    TOKEN_2022_PROGRAM_ID
  );

  const buyerTokenAccount = getAssociatedTokenAddressSync(
    mint,
    wallet.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID
  );

  const remainingAccounts = group?.item?.royalties?.shares.filter(item=>item.share > 0).map(item=>(
    {
      pubkey: item.recipient,
      isWritable: true,
      isSigner: false
    }
  )) ?? []

  const instruction = await librePlexProgram.methods
    .execute()
    .accounts({
      seller: (listing.item as any).lister,
      mint,
      metadata: metadata.pubkey,
      group: metadata.item.group,
      listing: listing.pubkey,
      buyer: wallet.publicKey,
      

      escrowTokenAccount,
      buyerTokenAccount,
      listerPaymentTokenAccount,
      buyerPaymentTokenAccount: buyerPaymentTokenAccount ?? undefined,
      
      
      paymentMint: (listing.item as any).price.spl?.mint ?? null, // undefined for native
      
      
      
      // usual solana gubbins
      systemProgram: SystemProgram.programId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenProgram2022: TOKEN_2022_PROGRAM_ID,
    }).remainingAccounts(remainingAccounts)
    .instruction();
  instructions.push(instruction);

  data.push({
    instructions,
    description: `Execute trade`,
    signers: [],
  });

  console.log({ data });

  return {
    data,
  };
};

export const ExecuteTradeTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IExecuteTrade>,
    "transactionGenerator"
  >
) => {


  return (
    <GenericTransactionButton<IExecuteTrade>
      text={`Buy`}
      transactionGenerator={executeTrade}
      onError={(msg) => notify({ message: msg ?? "Unknown error" })}
      {...props}
    />
  );
};
