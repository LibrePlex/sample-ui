import {
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  RawAccount,
  createTransferInstruction,
  createAssociatedTokenAccount,
  createAssociatedTokenAccountInstruction,
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
  Collection,
  IExecutorParams,
  IRpcObject,
  ITransactionTemplate,
  Metadata,
  getProgramInstanceShop,
  notify,
} from "@libreplex/shared-ui";

export interface IExecuteTrade {
  item: IRpcObject<RawAccount>;
  recipient: PublicKey;
  tokenProgram: PublicKey;
}

export const sendMint = async (
  { wallet, params }: IExecutorParams<IExecuteTrade>,
  connection: Connection
): Promise<{
  data?: ITransactionTemplate[];
  error?: any;
}> => {
  const data: ITransactionTemplate[] = [];

  const librePlexProgram = getProgramInstanceShop(connection, wallet);

  const blockhash = await connection.getLatestBlockhash()

  if (!librePlexProgram) {
    throw Error("IDL not ready");
  }
  const { item, recipient, tokenProgram } = params;

  let instructions: TransactionInstruction[] = [];

  const targetTokenAccount = getAssociatedTokenAddressSync(
    item.item.mint,
    recipient,
    true,
    tokenProgram
  );

  const account = await connection.getAccountInfo(targetTokenAccount);

  if (!account) {
    instructions.push(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        targetTokenAccount,
        recipient,
        item.item.mint,
        TOKEN_2022_PROGRAM_ID
      )
    );
  }

  /**
   * Construct a Transfer instruction
   *
   * @param source       Source account
   * @param destination  Destination account
   * @param owner        Owner of the source account
   * @param amount       Number of tokens to transfer
   * @param multiSigners Signing accounts if `owner` is a multisig
   * @param programId    SPL Token program account
   *
   * @return Instruction to add to a transaction
   */
  instructions.push(
    createTransferInstruction(
      item.pubkey,
      targetTokenAccount,
      item.item.owner,
      1,
      [],
      TOKEN_2022_PROGRAM_ID
    )
  );

  data.push({
    instructions,
    description: `Send mint`,
    signers: [],
    blockhash
  });

  console.log({ data });

  return {
    data,
  };
};

export const SendMintTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IExecuteTrade>,
    "transactionGenerator"
  >
) => {
  return (
    <GenericTransactionButton<IExecuteTrade>
      text={`Send`}
      transactionGenerator={sendMint}
      onError={(msg) => notify({ message: msg ?? "Unknown error" })}
      {...props}
    />
  );
};
