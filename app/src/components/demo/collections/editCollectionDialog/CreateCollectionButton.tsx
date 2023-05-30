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

import { getCollectionPda } from "pdas/getCollectionPda";
import { getUserPermissionsPda } from "pdas/getUserPermissionsPda";
import { Collection } from "query/collections";
import { notify } from "utils/notifications";



export interface ICreateCollection {
  name: string;
  symbol: string;
  collectionUrl: string;
  nftCollectionData: Collection["nftCollectionData"];
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

  const [collection] = getCollectionPda(seed.publicKey);

  const [userPermissions] = getUserPermissionsPda(collection, wallet.publicKey);

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

  const librePlexProgram = getProgramInstance(connection, {
    ...wallet,
    payer: Keypair.generate(),
  });

  const { symbol, name, collectionUrl, nftCollectionData } = params;

  console.log({nftCollectionData})

  const instruction = await librePlexProgram.methods
    .createCollection({
      name,
      symbol,
      nftCollectionData,
      collectionRenderMode: {
          url: {collectionUrl}
      }, 
      metadataRenderMode: {
        url: {
          baseUrlConfiguration: null
        }
      }
    })
    .accounts({
      authority: wallet.publicKey,
      userPermissions,
      collection,
      seed: seed.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

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
        text={"Create collection"}
        transactionGenerator={createCollection}
        onError={(msg)=>notify({message: msg})}
        {...props}
      />
    </>
  );
};
