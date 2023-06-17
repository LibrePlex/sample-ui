import { NEXT_PUBLIC_SHDW_ACCOUNT } from "@/environmentvariables";
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMint2Instruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";

import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  PROGRAM_ID_INSCRIPTIONS,
  getProgramInstance,
} from "anchor/getProgramInstance";
import { getProgramInstanceOrdinals } from "anchor/getProgramInstanceOrdinals";
import { IExecutorParams } from "components/executor/Executor";
import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
} from "components/executor/GenericTransactionButton";
import { ITransactionTemplate } from "components/executor/ITransactionTemplate";

import { notify } from "utils/notifications";

export enum AssetType {
  Image,
  Ordinal,
}

// export type Asset = {
//   type: AssetType.Image,
// } | {
//   type: AssetType.Ordinal
// }

export interface IResizeInscription {
  inscriptionKey: PublicKey;
  size: number;
}

// start at 0. We can extend as needed
export const ORDINAL_DEFAULT_LENGTH = 0;

export const resizeInscription = async (
  { wallet, params }: IExecutorParams<IResizeInscription>,
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

  const { inscriptionKey, size } = params;

  const instructions: TransactionInstruction[] = [];

  const instruction = await inscriptionsProgram.methods
    .resizeInscription({
      size,
    })
    .accounts({
      inscription: inscriptionKey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
  instructions.push(instruction);

  data.push({
    instructions,
    description: `Resize inscription`,
    signers: [],
  });

  console.log({ data });

  return {
    data,
  };
};

export const ResizeOrdinalTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IResizeInscription>,
    "transactionGenerator"
  >
) => {
  return (
    <>
      <GenericTransactionButton<IResizeInscription>
        text={"Resize inscription"}
        transactionGenerator={resizeInscription}
        onError={(msg) => notify({ message: msg })}
        {...props}
      />
    </>
  );
};
