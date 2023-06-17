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

import { getMetadataPda } from "pdas/getMetadataPda";
import { getPermissionsPda } from "pdas/getPermissionsPda";

import { IdlTypes } from "@coral-xyz/anchor";
import { Libreplex } from "types";
import { notify } from "utils/notifications";
import { getMetadataExtendedPda } from "pdas/getMetadataExtendedPda";

export type Royalties = IdlTypes<Libreplex>["ExtendMetadataInput"]["royalties"];
export type InvokedPermission =
  IdlTypes<Libreplex>["ExtendMetadataInput"]["invokedPermission"];

export interface IExtendMetadata {
  attributes: number[] | null;
  mint: PublicKey;
  group: PublicKey;
  royalties: Royalties | null;
}

export const extendMetadata = async (
  { wallet, params }: IExecutorParams<IExtendMetadata>,
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

  const { group, attributes, royalties, mint } = params;

  const librePlexProgram = getProgramInstance(connection, {
    ...wallet,
    payer: Keypair.generate(),
  });

  const [metadata] = getMetadataPda(mint);

  /// for convenience we are hardcoding the urls to predictable shadow drive ones for now.
  /// anything could be passed in obviously, including dynamic render modes !WE ASSUME PNG FOR NOW!

  // const url = `https://shdw-drive.genesysgo.net/${NEXT_PUBLIC_SHDW_ACCOUNT}/${mint.publicKey.toBase58()}.png`

  let instructions: TransactionInstruction[] = [];

  const [groupPermissions] = getPermissionsPda(group, wallet.publicKey);
  const [metadataPermissions] = getPermissionsPda(metadata, wallet.publicKey);

  const [metadataExtended] = getMetadataExtendedPda(metadata);

  console.log({
    attributes: Buffer.from(attributes),
    royalties,
    invokedPermission: 0 as InvokedPermission,
  });

  const instruction = await librePlexProgram.methods
    .extendMetadata({
      attributes: Buffer.from(attributes),
      royalties: null, // no override for now
      invokedPermission: { admin: {} },
    })
    .accounts({
      signer: wallet.publicKey,
      groupPermissions,
      metadataPermissions,
      metadataExtended,
      group,
      metadata,
      mint: mint,
      systemProgram: SystemProgram.programId,
    })
    .signers([])
    .instruction();

  instructions.push(instruction);
  data.push({
    instructions,
    description: `Extend metadata`,
    signers: [],
  });

  console.log({ data });

  return {
    data,
  };
};

export const ExtendMetadataButton = (
  props: Omit<
    GenericTransactionButtonProps<IExtendMetadata>,
    "transactionGenerator"
  >
) => {
  return (
    <>
      <GenericTransactionButton<IExtendMetadata>
        text={"Extend metadata"}
        transactionGenerator={extendMetadata}
        onError={(msg) => notify({ message: msg })}
        {...props}
        formatting={{ variant: "solid", colorScheme: "teal" }}
      />
    </>
  );
};
