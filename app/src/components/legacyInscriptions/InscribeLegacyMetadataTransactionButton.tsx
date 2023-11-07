import {
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import BN from "bn.js";
import React, { useMemo } from "react";
import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
  Collection,
  IExecutorParams,
  IRpcObject,
  ITransactionTemplate,
  Metadata,
  getProgramInstanceShop,
  LegacyMint,
  HttpClient,
  getLegacyMetadataPda,
} from "@libreplex/shared-ui";

import { Price, notify } from "@libreplex/shared-ui";
import { IdlAccounts } from "@coral-xyz/anchor";
import { LibreplexShop } from            "@libreplex/idls/lib/types/libreplex_shop";
import { ITransaction } from "../../transactions/ITransaction";
import { getProgramInstanceLegacyInscriptions } from "shared-ui/src/anchor/legacyInscriptions/getProgramInstanceLegacyInscriptions";
import { NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID } from "@app/environmentvariables";

export interface IInscribeLegacyMint {
  legacyMint: LegacyMint;
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

  const { legacyMint } = params;

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
      blockhash: serializedTx.blockhash
    });
  }
  console.log({data});

  return {
    data,
  };
};

export const InscribeLegacyMetadataTransactionButton = (
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
