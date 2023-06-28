import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { getProgramInstanceOrdinals } from "shared-ui";
import { IExecutorParams } from "shared-ui";
import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
} from "shared-ui";
import { IRpcObject } from "shared-ui";
import { ITransactionTemplate } from "shared-ui";
import { Inscription } from "shared-ui";

import { notify } from "shared-ui";

export enum AssetType {
  Image,
  Ordinal,
}

// export type Asset = {
//   type: AssetType.Image,
// } | {
//   type: AssetType.Ordinal
// }

export interface IWriteToInscription {
  inscription: IRpcObject<Inscription>;
  dataBytes: number[];
}

export const BATCH_SIZE = 924;

// start at 0. We can extend as needed
export const ORDINAL_DEFAULT_LENGTH = 0;

export const writeToInscription = async (
  { wallet, params }: IExecutorParams<IWriteToInscription>,
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

  const inscriptionsProgram = getProgramInstanceOrdinals(connection, {
    ...wallet,
    payer: Keypair.generate(),
  });

  const { inscription, dataBytes } = params;

  //   const instruction = await inscriptionsProgram.methods
  //     .resizeInscription({
  //       size: dataBytes.length,
  //     })
  //     .accounts({
  //       inscription: inscription.pubkey,
  //       systemProgram: SystemProgram.programId,
  //     })
  //     .instruction();
  //   instructions.push(instruction);

  const remainingBytes = [...dataBytes];
  let startPos = 0;
  while (remainingBytes.length > 0) {
    const instructions: TransactionInstruction[] = [];
    const byteBatch = remainingBytes.splice(0, BATCH_SIZE);
    console.log({
      byteBatch,
      startPos,
    });
    instructions.push(
      await inscriptionsProgram.methods
        .writeToInscription({
          data: Buffer.from(byteBatch),
          startPos,
        })
        .accounts({
          signer: wallet.publicKey,
          inscription: inscription.pubkey,
          systemProgram: SystemProgram.programId,
        })
        .instruction()
    );
    startPos += BATCH_SIZE;

    data.push({
      instructions,
      description: `Write to inscription`,
      signers: [],
    });
  }

  console.log({ data });

  return {
    data,
  };
};

export const WriteToInscriptionTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IWriteToInscription>,
    "transactionGenerator"
  >
) => {
  return (
    <>
      <GenericTransactionButton<IWriteToInscription>
        text={"Write"}
        transactionGenerator={writeToInscription}
        onError={(msg) => notify({ message: msg })}
        {...props}
      />
    </>
  );
};
