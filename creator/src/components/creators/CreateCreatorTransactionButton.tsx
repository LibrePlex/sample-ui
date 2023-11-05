import { NEXT_PUBLIC_SHDW_ACCOUNT } from "@app/environmentvariables";

import { setupLibreplexReadyMint } from "@libreplex/sdk";

import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  AssetUrl,
  PROGRAM_ID_INSCRIPTIONS,
  getProgramInstanceMetadata,
} from "@libreplex/shared-ui";
import { IExecutorParams } from "@libreplex/shared-ui";
import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
} from "@libreplex/shared-ui";
import { ITransactionTemplate } from "@libreplex/shared-ui";

import { getMetadataPda } from "@libreplex/shared-ui";
import { notify } from "@libreplex/shared-ui";
import React from "react";
import { getProgramInstanceCreator } from "shared-ui/src/anchor/creator/getProgramInstanceCreator";

export enum AssetType {
  Image,
  Inscription,
}

export interface ICreateCreator {
  maxMints: number;
  name: string;
  symbol: string;
  assetUrl: AssetUrl;
  attributeMappings: PublicKey | null;
  description: string | null;
  mint: Keypair;
  collection: PublicKey | null;
  extension: {
    attributes: number[];
  } | null;
  mintAuthority: PublicKey;
  isOrdered: boolean;
}

// start at 0. We can extend as needed
export const INSCRIPTION_DEFAULT_LENGTH = 0;

export const createMetadata = async (
  { wallet, params }: IExecutorParams<ICreateCreator>,
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

  const {
    maxMints,
    symbol,
    name,
    collection,
    description,
    attributeMappings,
    assetUrl,
    mintAuthority,
    isOrdered
  } = params;

  const libreplexCreator = getProgramInstanceCreator(connection, wallet);

  const seed = Keypair.generate();

  /// for convenience we are hardcoding the urls to predictable shadow drive ones for now.
  /// anything could be passed in obviously. !WE ASSUME PNG FOR NOW!

  let instructions: TransactionInstruction[] = [];

  instructions.push(
    await libreplexCreator.methods
      .createCreator({
        maxMints,
        seed: seed.publicKey,
        symbol,
        assetUrl,
        collection,
        description,
        attributeMappings,
        mintAuthority,
        isOrdered,
        name,
      })
      .accounts({
        signer: wallet.publicKey,
        creator,
        minterNumbers,
        systemProgram: SystemProgram.programId,
      })
      .instruction()
  );

  const signers: Keypair[] = [];

  data.push({
    instructions,
    description: `Create creator`,
    signers,
  });

  console.log({ data });

  return {
    data,
  };
};

export const CreateCreatorTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<ICreateCreator>,
    "transactionGenerator"
  >
) => {
  return (
    <>
      <GenericTransactionButton<ICreateCreator>
        text={"Create metadata"}
        transactionGenerator={createMetadata}
        onError={(msg) => notify({ message: msg ?? "N/A" })}
        {...props}
      />
    </>
  );
};
