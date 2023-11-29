import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
  HttpClient,
  IExecutorParams,
  ITransactionTemplate,
  getLegacyMetadataPda
} from "@libreplex/shared-ui";
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction
} from "@solana/web3.js";

import { NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID } from "@app/environmentvariables";
import { notify } from "@libreplex/shared-ui";
import { getProgramInstanceLegacyInscriptions } from "@libreplex/shared-ui/src/anchor/legacyInscriptions/getProgramInstanceFairLaunch";
import { ITransaction } from "../../transactions/ITransaction";

export interface IInscribeLegacyMint {
  mint: PublicKey;
}

export const inscribeLegacyMint = async (
  { wallet, params }: IExecutorParams<IInscribeLegacyMint>,
  connection: Connection,
  cluster: string
): Promise<{
  data?: ITransactionTemplate[];
  error?: any;
}> => {
  const data: ITransactionTemplate[] = [];

  const legacyInscriptionsProgram = getProgramInstanceLegacyInscriptions(
    connection,
    wallet
  );

  if (!legacyInscriptionsProgram) {
    throw Error("IDL not ready");
  }

  const { mint } = params;

  const httpClient = new HttpClient("/api");

  console.log({ mint: mint.toBase58() });

  const { data: txData } = await httpClient.post<ITransaction>(
    `/tx/update_legacy_inscription_validation_hash/${mint.toBase58()}`,
    {
      payerId: wallet.publicKey.toBase58(),
      legacyMetadataId: getLegacyMetadataPda(mint)[0].toBase58(),
      cluster,
    }
  );

  for (const serializedTx of txData.partiallySignedTxs) {
    let instructions: TransactionInstruction[] = [];
    // const tx = Transaction.from(serializedTx.buffer);
    // for (const signature of serializedTx.signatures) {
    //   tx.addSignature(
    //     new PublicKey(signature.pubkey),
    //     Buffer.from(signature.signature)
    //   );
    // }
    instructions.push(...Transaction.from(serializedTx.buffer).instructions);
    data.push({
      instructions,
      signers: [],
      signatures: serializedTx.signatures,
      description: "Inscribe legacy metadata",
      blockhash: serializedTx.blockhash,
    });
  }

  return {
    data,
  };
};

export const UpdateLegacyMetadataValidationHashTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IInscribeLegacyMint>,
    "transactionGenerator"
  >
) => {
  return (
    <GenericTransactionButton<IInscribeLegacyMint>
      text={`Update`}
      transactionGenerator={inscribeLegacyMint}
      onError={(msg) => notify({ message: msg ?? "Unknown error" })}
      {...props}
    />
  );
};
