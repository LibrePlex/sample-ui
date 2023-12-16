import {
  Connection,
  Keypair,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
  IExecutorParams,
  IRpcObject,
  ITransactionTemplate,
} from "../../executor";
import { Inscription, InscriptionV3 } from "../../../sdk";
import {
  PROGRAM_ID_INSCRIPTIONS,
  getProgramInstanceInscriptions,
} from "../../../sdk/query/inscriptions/getProgramInstanceInscriptions";
import {
  getInscriptionPda,
  getInscriptionSummaryPda,
  getInscriptionV3Pda,
  getLegacySignerPda,
  getProgramInstanceLegacyInscriptions,
  notify,
} from "../../../..";
import React from "react";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { getLegacyInscriptionPda } from "../../../pdas/getLegacyInscriptionPda";

export enum AssetType {
  Image,
  Inscription,
}

// export type Asset = {
//   type: AssetType.Image,
// } | {
//   type: AssetType.Inscription
// }

export interface IMakeLegacyInscriptionImmutable {
  inscriptionV3: IRpcObject<InscriptionV3>;
  metadata: IRpcObject<Metadata>;
}

export const makeLegacyInscriptionImmutable = async (
  { wallet, params }: IExecutorParams<IMakeLegacyInscriptionImmutable>,
  connection: Connection
): Promise<{
  data?: ITransactionTemplate[];
  error?: any;
}> => {
  if (!wallet.publicKey) {
    throw Error("Wallet key missing");
  }

  const data: ITransactionTemplate[] = [];

  const blockhash = await connection.getLatestBlockhash();

  const legacyInscriptionsProgram = getProgramInstanceLegacyInscriptions(
    connection,
    wallet
  );

  const inscriptionsProgram =getProgramInstanceInscriptions(
    connection,
    wallet
  );


  const { inscriptionV3, metadata } = params;

  console.log({ root: inscriptionV3?.item.root.toBase58() });
  const legacyInscription = getLegacyInscriptionPda(inscriptionV3?.item.root);

  const inscriptionSummary = getInscriptionSummaryPda()[0];
  console.log({
    authority: wallet.publicKey.toBase58(),
    mint: inscriptionV3.item.root.toBase58(),
    inscription: inscriptionV3.pubkey.toBase58(),
    inscriptionSummary: inscriptionSummary?.toBase58(),
    legacyMetadata: metadata.pubkey.toBase58(),
    legacyInscription: legacyInscription.toBase58(),
    systemProgram: SystemProgram.programId.toBase58(),
    inscriptionsProgram: PROGRAM_ID_INSCRIPTIONS,
  });

  const instructions: TransactionInstruction[] = [];

  const inscription = getInscriptionPda(
    inscriptionV3.item.root
  )[0];


  console.log({legacyInscription:legacyInscription.toBase58()})
  const instruction = await legacyInscriptionsProgram.methods
    .makeImmutable()
    .accounts({
      authority: wallet.publicKey,
      mint: inscription.item.root,
      inscription: inscription.pubkey,
      inscriptionV2: inscriptionV3.pubkey,
      inscriptionSummary,
      legacyMetadata: metadata.pubkey,
      legacyInscription,
      systemProgram: SystemProgram.programId,
      inscriptionsProgram: PROGRAM_ID_INSCRIPTIONS,
    })
    .instruction();
  instructions.push(instruction);

  data.push({
    instructions,
    description: `Make immutable`,
    signers: [],
    blockhash,
  });

  console.log({ data });

  return {
    data,
  };
};

export const MakeLegacyInscriptionImmutableTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IMakeLegacyInscriptionImmutable>,
    "transactionGenerator"
  >
) => {
  return (
    <>
      <GenericTransactionButton<IMakeLegacyInscriptionImmutable>
        text={"Make immutable"}
        transactionGenerator={makeLegacyInscriptionImmutable}
        onError={(msg) => notify({ message: msg })}
        {...props}
      />
    </>
  );
};
