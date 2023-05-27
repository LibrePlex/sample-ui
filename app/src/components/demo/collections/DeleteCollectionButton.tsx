import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { IExecutorParams } from "components/executor/Executor";
import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
} from "components/executor/GenericTransactionButton";
import { ITransactionTemplate } from "components/executor/ITransactionTemplate";
import { createDeleteCollectionInstruction } from "generated/libreplex";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { usePermissionsHydratedWithCollections } from "stores/accounts/useCollectionsById";
import { usePermissionsByAuthority } from "stores/accounts/usePermissionsByAuthority";

export interface INftCollectionData {
  royaltyBps: number;
  royaltyShares: {
    recipient: PublicKey;
    share: number;
  }[];
  permittedSigners;
}

export interface IDeleteCollection {
  collection: PublicKey;
  collectionPermissions: PublicKey;
}

export const deleteCollection = async (
  { wallet, params }: IExecutorParams<IDeleteCollection>,
  connection: Connection
): Promise<{
  data?: ITransactionTemplate[];
  error?: any;
}> => {
  if (!wallet.publicKey) {
    throw Error("Wallet key missing");
  }
  //  / alert('here');
  console.log({ params });

  const data: {
    instructions: TransactionInstruction[];
    signers: Keypair[];
    description: string;
  }[] = [];

  const seed = Keypair.generate();

  const { collection, collectionPermissions } = params;

  const instruction = createDeleteCollectionInstruction({
    signer: wallet.publicKey,
    signerCollectionPermissions: collectionPermissions,
    collection,
    receiver: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  });

  let instructions: TransactionInstruction[] = [];
  instructions.push(instruction);
  data.push({
    instructions,
    description: `Delete collection`,
    signers: [],
  });

  console.log({ data });

  return {
    data,
  };
};

export const DeleteCollectionTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IDeleteCollection>,
    "transactionGenerator"
  >
) => {
  const { publicKey } = useWallet();
  const { collection } = props.params;

  const { connection } = useConnection();

  const {
    items: permissions,
  } = usePermissionsByAuthority(publicKey, connection);


  const {
    items: collections,
    removeCollection,
    isFetching,
    clear,
  } = usePermissionsHydratedWithCollections(permissions, connection);


  const [deleted, setDeleted] = useState<boolean>(false);
  return (
    <>
      <GenericTransactionButton<IDeleteCollection>
        disabled={deleted}
        text={"Delete"}
        transactionGenerator={deleteCollection}
        {...props}
        onSuccess={(msg) => {
          setDeleted(true);
          removeCollection(collection);
        }}
      />
    </>
  );
};
