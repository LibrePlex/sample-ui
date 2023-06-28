import { NEXT_PUBLIC_SHDW_ACCOUNT } from "@/environmentvariables";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { AttributeType, GroupInput, getProgramInstanceMetadata } from "shared-ui";
import { IExecutorParams } from "shared-ui";
import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
} from "shared-ui";
import { ITransactionTemplate } from "shared-ui";

import { getGroupPda } from "shared-ui";
import { getPermissionsPda } from "shared-ui";
import { Group } from "shared-ui";
import { notify } from "shared-ui";

export interface ICreateCollection {
  name: string;
  symbol: string;
  description: string;
  attributeTypes: AttributeType;
  royalties: GroupInput["royalties"];
  permittedSigners: GroupInput["permittedSigners"]
}

export const createCollection = async (
  { wallet, params }: IExecutorParams<ICreateCollection>,
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

  const seed = Keypair.generate();

  const [group] = getGroupPda(seed.publicKey);

  const [permissions] = getPermissionsPda(group, wallet.publicKey);

  // const a = createDeleteCollectionInstruction({
  //   authority: wallet.publicKey,
  //       collectionData: collectionPda,
  //       collectionSeed: seed.publicKey,
  //       receiver: wallet.publicKey,
  //       systemProgram: SystemProgram.programId,
  // }, {
  //   bumpCollectionData: 1
  // })

  // console.log({a});

  const librePlexProgram = getProgramInstanceMetadata(connection, {
    ...wallet,
    payer: Keypair.generate(),
  });

  const { symbol, name, permittedSigners, attributeTypes, description, royalties } = params;

  /// for convenience we are hardcoding the urls to predictable shadow drive ones for now.
  /// anything could be passed in obviously. !WE ASSUME PNG FOR NOW!

  const url = `https://shdw-drive.genesysgo.net/${NEXT_PUBLIC_SHDW_ACCOUNT}/${group.toBase58()}.png`;

  console.log({
    authority: wallet.publicKey.toBase58(),
    permissions: permissions.toBase58(),
    group: group.toBase58(),
    seed: seed.publicKey.toBase58(),
    systemProgram: SystemProgram.programId.toBase58(),
  })


  const instruction = await librePlexProgram.methods
    .createGroup({
      name,
      symbol,
      description,
      attributeTypes,
      royalties,
      permittedSigners,
      url,
      templateConfiguration: {none: {}},
    
    })
    .accounts({
      authority: wallet.publicKey,
      group,
      seed: seed.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
  console.log("INSTRUCTION CREATED");
  let instructions: TransactionInstruction[] = [];
  instructions.push(instruction);
  data.push({
    instructions,
    description: `Create collection`,
    signers: [],
  });

  console.log({ data });

  return {
    data,
  };
};

export const CreateCollectionTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<ICreateCollection>,
    "transactionGenerator"
  >
) => {
  return (
    <>
      <GenericTransactionButton<ICreateCollection>
        text={"Create group"}
        transactionGenerator={createCollection}
        onError={(msg) => notify({ message: msg })}
        {...props}
      />
    </>
  );
};
