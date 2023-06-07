import { NEXT_PUBLIC_SHDW_ACCOUNT } from "@/environmentvariables";
import { MINT_SIZE, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createInitializeMint2Instruction, createMintToInstruction, getAssociatedTokenAddressSync, getMinimumBalanceForRentExemptMint } from "@solana/spl-token";
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
  GenericTransactionButton,
  GenericTransactionButtonProps,
} from "components/executor/GenericTransactionButton";
import { ITransactionTemplate } from "components/executor/ITransactionTemplate";

import { getGroupPda } from "pdas/getCollectionPda";
import { getMetadataPda } from "pdas/getMetadataPda";
import { getPermissionsPda } from "pdas/getPermissionsPda";
import { Group } from "query/group";
import { notify } from "utils/notifications";



export interface ICreateMetadata {
  name: string;
  symbol: string;
  url: string;
  description: string | null;
  mint: Keypair;

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

  const librePlexProgram = getProgramInstance(connection, {
    ...wallet,
    payer: Keypair.generate(),
  });

  const { symbol, name, description, mint} = params;

  const [metadata] = getMetadataPda(mint.publicKey)

  /// for convenience we are hardcoding the urls to predictable shadow drive ones for now. 
  /// anything could be passed in obviously. !WE ASSUME PNG FOR NOW!

  const url = `https://metadata.libreplex.io/${mint.publicKey.toBase58()}.json`

  console.log({args: {
    name,
    symbol,
    description,
  }});

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

  console.log('Creating instruction');

  const instruction = await librePlexProgram.methods
    .createMetadata({
      name,
      symbol,
      description,
      url
    })
    .accounts({
      metadata,
      mint: mint.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
    console.log('INSTRUCTION CREATED');
  
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
        onError={(msg)=>notify({message: msg})}
        {...props}
      />
    </>
  );
};
