import { NEXT_PUBLIC_SHDW_ACCOUNT } from "@app/environmentvariables";
// import {
//   MINT_SIZE,
//   TOKEN_2022_PROGRAM_ID,
//   createAssociatedTokenAccountInstruction,
//   createInitializeMint2Instruction,
//   createMintToInstruction,
//   getAssociatedTokenAddressSync,
//   getMinimumBalanceForRentExemptMint,
// } from "@solana/spl-token";


// runtime error: TypeError: (0 , _libreplex_sdk__WEBPACK_IMPORTED_MODULE_9__.setupLibreplexReadyMint) is not a function
// import { setupLibreplexReadyMint } from "@libreplex/sdk"

import {setupLibreplexReadyMint} from "@libreplex/sdk";

import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
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

export enum AssetType {
  Image,
  Inscription,
}

// export type Asset = {
//   type: AssetType.Image,
// } | {
//   type: AssetType.Ordinal
// }

export interface ICreateMetadata {
  name: string;
  symbol: string;
  assetType: AssetType;
  description: string | null;
  mint: Keypair;
  collection: PublicKey | null;
  extension: {
    attributes: number[];
  } | null;
  metadataProgramId: PublicKey;
}

// start at 0. We can extend as needed
export const ORDINAL_DEFAULT_LENGTH = 0;

export const createMetadata = async (
  { wallet, params }: IExecutorParams<ICreateMetadata>,
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
    assetType,
    symbol,
    name,
    collection,
    description,
    mint,
    extension,
    metadataProgramId,
  } = params;

  const librePlexProgram = getProgramInstanceMetadata(
    metadataProgramId,
    connection,
    wallet
  );

  const [metadata] = getMetadataPda(metadataProgramId, mint.publicKey);

  /// for convenience we are hardcoding the urls to predictable shadow drive ones for now.
  /// anything could be passed in obviously. !WE ASSUME PNG FOR NOW!

  let instructions: TransactionInstruction[] = [];


  const {transaction: txSetup} = await setupLibreplexReadyMint(
    connection,
    wallet.publicKey,
    wallet.publicKey,
    wallet.publicKey,
    wallet.publicKey,
    0,
    mint,
    metadata,
    // no further parameters, this defaults to
    // 1) no transfer hook
    // 2) token program 2022
  ) as {transaction: Transaction}

  const signers = [mint];

  if (assetType === AssetType.Image) {
    const url = `https://shdw-drive.genesysgo.net/${NEXT_PUBLIC_SHDW_ACCOUNT}/${mint.publicKey.toBase58()}.png`;

    const instruction = await librePlexProgram.methods
      .createMetadata({
        name,
        symbol,
        updateAuthority: wallet.publicKey,

        asset: {
          image: {
            url,
            description,
          },
        },
        extension: extension
          ? {
              nft: {
                attributes: Buffer.from(extension.attributes),
                signers: [],
                royalties: null,
                license: null,
              },
            }
          : {
            none: {}
          },
      })
      .accounts({
        metadata,
        mint: mint.publicKey,
        systemProgram: SystemProgram.programId,
        invokedMigratorProgram: null,
      })
      .instruction();
    instructions.push(instruction);
  } else if (assetType === AssetType.Inscription) {
    const inscription = Keypair.generate();

    const ordinalLamports = await connection.getMinimumBalanceForRentExemption(
      8 + 32 + 32 + 4 + 4 + ORDINAL_DEFAULT_LENGTH
    );
    signers.push(inscription);
    instructions.push(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: inscription.publicKey,
        space: 8 + 32 + 32 + 4 + 4 + ORDINAL_DEFAULT_LENGTH,
        lamports: ordinalLamports,
        programId: new PublicKey(PROGRAM_ID_INSCRIPTIONS),
      })
    );

    const instruction = await librePlexProgram.methods
      .createInscriptionMetadata(
        {
          updateAuthority: wallet.publicKey,
          name,
          symbol,
          description,
          dataType: "",
          extension: extension
            ? {
                nft: {
                  attributes: Buffer.from(extension.attributes),
                  signers: [],
                  royalties: null,
                  license: null,
                },
              }
            : {
              none: {}
            },
        }
      )
      .accounts({
        metadata,
        inscription: inscription.publicKey,
        mint: mint.publicKey,
        systemProgram: SystemProgram.programId,
        inscriptionsProgram: new PublicKey(PROGRAM_ID_INSCRIPTIONS),
      })
      .instruction();
    instructions.push(instruction);
  }

  console.log({ collection });

  if (collection) {
    instructions.push(
      await librePlexProgram.methods
        .addMetadataToCollection()
        .accounts({
          metadataAuthority: wallet.publicKey,
          collectionAuthority: wallet.publicKey,
          payer: wallet.publicKey,
          metadata,
          delegatedCollectionWidePermissions: null,
          delegatedMetadataSpecificPermissions: null,
          collection,
          systemProgram: SystemProgram.programId,
        })
        .instruction()
    );
  }

  console.log("INSTRUCTION CREATED");

  data.push({
    instructions: [...txSetup.instructions,...instructions],
    description: `Create metadata`,
    signers,
  });

  console.log({ data });

  return {
    data,
  };
};

export const CreateMetadataTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<ICreateMetadata>,
    "transactionGenerator"
  >
) => {
  return (
    <>
      <GenericTransactionButton<ICreateMetadata>
        text={"Create metadata"}
        transactionGenerator={createMetadata}
        onError={(msg) => notify({ message: msg ?? "N/A" })}
        {...props}
      />
    </>
  );
};
