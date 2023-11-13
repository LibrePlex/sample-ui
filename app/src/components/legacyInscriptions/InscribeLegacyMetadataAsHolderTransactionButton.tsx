import {
    GenericTransactionButton,
    GenericTransactionButtonProps,
    HttpClient,
    IExecutorParams,
    ITransactionTemplate,
    MintWithTokenAccount,
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
import { getProgramInstanceLegacyInscriptions } from "shared-ui/src/anchor/legacyInscriptions/getProgramInstanceLegacyInscriptions";
import { ITransaction } from "../../transactions/ITransaction";

export interface IInscribeLegacyMint {
  mint: MintWithTokenAccount;
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
    new PublicKey(NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID),
    connection,
    wallet
  );

  if (!legacyInscriptionsProgram) {
    throw Error("IDL not ready");
  }

  const { mint: legacyMint } = params;

  const httpClient = new HttpClient("/api");

  console.log({ mint: legacyMint.mint.toBase58() });

  const { data: txData } = await httpClient.post<ITransaction>(
    `/tx/create_legacy_inscription_as_holder/${legacyMint.mint.toBase58()}`,
    {
      payerId: wallet.publicKey.toBase58(),
      legacyMetadataId: getLegacyMetadataPda(legacyMint.mint)[0].toBase58(),
      tokenAccountId: legacyMint.tokenAccount.pubkey.toBase58(),
      ownerId: legacyMint.tokenAccount.item.owner.toBase58(),
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
  console.log({ data });

  return {
    data,
  };
};

export const InscribeLegacyMetadataAsHolderTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IInscribeLegacyMint>,
    "transactionGenerator"
  >
) => {
  return (
    <GenericTransactionButton<IInscribeLegacyMint>
      text={`Inscribe`}
      transactionGenerator={inscribeLegacyMint}
      onError={(msg) => notify({ message: msg ?? "Unknown error" })}
      {...props}
    />
  );
};
