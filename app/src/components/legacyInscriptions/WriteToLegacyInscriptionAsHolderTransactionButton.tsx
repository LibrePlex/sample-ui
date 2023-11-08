import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
  IExecutorParams,
  IRpcObject,
  ITransactionTemplate,
  Inscription,
  PROGRAM_ID_INSCRIPTIONS,
  getInscriptionDataPda,
  getInscriptionPda,
  getLegacyMetadataPda,
} from "@libreplex/shared-ui";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

import { NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID } from "@app/environmentvariables";
import { notify } from "@libreplex/shared-ui";
import { AccountLayout } from "@solana/spl-token";
import { getProgramInstanceLegacyInscriptions } from "shared-ui/src/anchor/legacyInscriptions/getProgramInstanceLegacyInscriptions";
import { getLegacyInscriptionPda } from "shared-ui/src/pdas/getLegacyInscriptionPda";
import { ITransaction } from "../../transactions/ITransaction";

export interface IWriteToLegacyInscriptionAsHolder {
  mint: PublicKey;
  dataBytes: number[];
}

export const BATCH_SIZE = 800;

export const resizeLegacyInscription = async (
  { wallet, params }: IExecutorParams<IWriteToLegacyInscriptionAsHolder>,
  connection: Connection,
  cluster: string
): Promise<{
  data?: ITransactionTemplate[];
  error?: any;
}> => {
  const data: ITransactionTemplate[] = [];

  const legacyInscriptionsProgram = getProgramInstanceLegacyInscriptions(
    new PublicKey(NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID),
    connection,
    wallet
  );

  if (!legacyInscriptionsProgram) {
    throw Error("IDL not ready");
  }

  // have to check the owner here - unfortunate as it's expensive
  const { mint, dataBytes } = params;

  const tokenAccounts = await connection.getTokenLargestAccounts(mint);

  let owner: PublicKey;
  let tokenAccount: PublicKey;

  for (const ta of tokenAccounts.value) {
    if (BigInt(ta.amount) > BigInt(0)) {
      tokenAccount = ta.address;
    }
  }

  if (!tokenAccount) {
    throw Error("Token account not found for mint");
  }

  const tokenAccountData = await connection.getAccountInfo(tokenAccount);

  const inscription = getInscriptionPda(mint)[0];

  const inscriptionData = getInscriptionDataPda(mint)[0];
  const legacyInscription = getLegacyInscriptionPda(mint)[0];

  const tokenAccountObj = AccountLayout.decode(tokenAccountData.data);

  owner = tokenAccountObj.owner;

  

  // TODO: Update inscription media type and encoding type
  // instructions.push(
  //   await legacyInscriptionsProgram.methods
  //     .updateInscriptionDatatypeAsHolder({
  //       dataType,
  //     })
  //     .accounts({
  //       editor: wallet.publicKey,
  //       metadata: metadata.pubkey,
  //       delegatedGroupWidePermissions: null,
  //       delegatedMetadataSpecificPermissions: null,
  //       collection: metadata.item.collection,
  //       systemProgram: SystemProgram.programId,
  //     })
  //     .instruction()
  // );

  let startPos = 0;
  const blockhash = await connection.getLatestBlockhash();
  const remainingBytes = [...dataBytes];
  while (remainingBytes.length > 0) {
    const instructions: TransactionInstruction[] = [];

    const byteBatch = remainingBytes.splice(0, BATCH_SIZE);

    instructions.push(
      await legacyInscriptionsProgram.methods
        .writeToLegacyInscriptionAsHolder({
          data: Buffer.from(byteBatch),
          startPos,
        })
        .accounts({
          owner: wallet.publicKey,
          mint,
          inscription,
          inscriptionData,
          tokenAccount,
          legacyInscription,
          systemProgram: SystemProgram.programId,
          inscriptionsProgram: PROGRAM_ID_INSCRIPTIONS,
        })
        .instruction()
    );
    startPos += BATCH_SIZE;
    data.push({
      instructions,
      signers: [],
      signatures: [],
      description: "Resize legacy inscription",
      blockhash,
    });
  }

  return {
    data,
  };
};

export const WriteToLegacyInscriptionAsHolderTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IWriteToLegacyInscriptionAsHolder>,
    "transactionGenerator"
  >
) => {
  return (
    <GenericTransactionButton<IWriteToLegacyInscriptionAsHolder>
      text={`Inscribe`}
      transactionGenerator={resizeLegacyInscription}
      onError={(msg) => notify({ message: msg ?? "Unknown error" })}
      {...props}
    />
  );
};
