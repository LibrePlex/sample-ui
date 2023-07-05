import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { getGroupPda, getProgramInstanceMetadata } from "shared-ui";
import { IExecutorParams } from "shared-ui";
import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
} from "shared-ui";
import { ITransactionTemplate } from "shared-ui";


export interface INftCollectionData {
  royaltyBps: number;
  royaltyShares: {
    recipient: PublicKey;
    share: number;
  }[];
  permittedSigners;
}

export interface ICreateCollection {
  name: string;
  symbol: string;
  collectionUrl: string;
  nftCollectionData: INftCollectionData;
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

  const [collection] = getGroupPda(seed.publicKey);

  // const [userPermissions] = getPermissionsPda(collection, wallet.publicKey);

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

  const librePlexProgram = getProgramInstanceMetadata(connection, wallet);

  const { symbol, name, collectionUrl, nftCollectionData } = params;

  // const instruction = await librePlexProgram.methods
  //   .createCollection({
  //     name,
  //     symbol,
  //     collectionUrl,
  //     nftCollectionData: params.nftCollectionData,
  //   })
  //   .accounts({
  //     authority: wallet.publicKey,
  //     userPermissions,
  //     collection,
  //     seed: seed.publicKey,
  //     systemProgram: SystemProgram.programId,
  //   })
  //   .instruction();

  let instructions: TransactionInstruction[] = [];
  // instructions.push(instruction);
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
        {...props}
      />
    </>
  );
};
