import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { getProgramInstance } from "anchor/getProgramInstance";
import { IExecutorParams } from "components/executor/Executor";
import {
  createMintToInstruction,
  createInitializeMint2Instruction,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync
} from "@solana/spl-token";
import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
} from "components/executor/GenericTransactionButton";
import { ITransactionTemplate } from "components/executor/ITransactionTemplate";

import { getMetadataPda } from "pdas/getMetadataPda";
import { getUserPermissionsPda } from "pdas/getUserPermissionsPda";
import { notify } from "utils/notifications";
import { NEXT_PUBLIC_SHDW_ACCOUNT } from "@/environmentvariables";

export interface ICreateMetadata {
  name: string;
  attributes: number[] | null;
  mint: Keypair;
  collection: PublicKey;
}

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

  const { collection, name,  attributes, mint } = params;

  const [signerCollectionPermissions] = getUserPermissionsPda(
    collection,
    wallet.publicKey
  );

  const librePlexProgram = getProgramInstance(connection, {
    ...wallet,
    payer: Keypair.generate(),
  });

  const [metadata] = getMetadataPda(mint.publicKey);

  /// for convenience we are hardcoding the urls to predictable shadow drive ones for now. 
  /// anything could be passed in obviously, including dynamic render modes !WE ASSUME PNG FOR NOW!

  const url = `https://shdw-drive.genesysgo.net/${NEXT_PUBLIC_SHDW_ACCOUNT}/${mint.publicKey.toBase58()}.png`

  let instructions: TransactionInstruction[] = [];

  const lamports = await getMinimumBalanceForRentExemptMint(connection);
  
  const ata = getAssociatedTokenAddressSync(mint.publicKey,
    wallet.publicKey)

  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mint.publicKey,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMint2Instruction(
      mint.publicKey,
      0,
      wallet.publicKey,
      wallet.publicKey,
      TOKEN_PROGRAM_ID
    ),
    createAssociatedTokenAccountInstruction(
      wallet.publicKey,
      ata,
      wallet.publicKey,
      mint.publicKey
    ),
    createMintToInstruction(
      mint.publicKey,
      ata,
      wallet.publicKey,
      1,
      [],
      TOKEN_PROGRAM_ID
    )
  );

  const instruction = await librePlexProgram.methods
    .createMetadata({
      name,
      renderModeData: {
        url: { url },
      },
      nftMetadata: attributes
        ? {
            attributes: Buffer.from(attributes),
          }
        : null,
    })
    .accounts({
      signer: wallet.publicKey,
      signerCollectionPermissions,
      collection,
      metadata,
      mint: mint.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([mint])
    .instruction();

  instructions.push(instruction);
  data.push({
    instructions,
    description: `Create metadata`,
    signers: [mint],
  });

  console.log({ data });

  return {
    data,
  };
};

export const CreateMetadataButton = (
  props: Omit<
    GenericTransactionButtonProps<ICreateMetadata>,
    "transactionGenerator"
  >
) => {
  return (
    <>
     
      <GenericTransactionButton<ICreateMetadata>
        text={"Mint into this collection"}
        
        transactionGenerator={createMetadata}
        onError={(msg) => notify({ message: msg })}
        {...props}
        formatting={{variant:'solid',colorScheme:"teal"}}
      />
    </>
  );
};
