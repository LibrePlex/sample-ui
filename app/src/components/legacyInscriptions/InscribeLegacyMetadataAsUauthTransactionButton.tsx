import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
  IExecutorParams,
  ITransactionTemplate,
  decodeLegacyMetadata,
  getInscriptionDataPda,
  getInscriptionPda,
  getInscriptionRankPda,
  getInscriptionSummaryPda,
  getLegacyMetadataPda,
  getLegacySignerPda,
  getProgramInstanceInscriptions,
} from "@libreplex/shared-ui";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";

import { NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID } from "@app/environmentvariables";
import { notify } from "@libreplex/shared-ui";
import { getProgramInstanceLegacyInscriptions } from "shared-ui/src/anchor/legacyInscriptions/getProgramInstanceLegacyInscriptions";
import { getLegacyInscriptionPda } from "shared-ui/src/pdas/getLegacyInscriptionPda";

import { IWebHashAndBuffer, getLegacyCompressedImage } from "shared-ui/src/components/assetdisplay/useLegacyCompressedImage";
import { getImageAsBuffer } from "@libreplex/shared-ui";
import { calculateHashFromBuffer } from "@app/utils/calculateHashFromBuffer";

export interface IInscribeLegacyMint {
  mint: PublicKey;
  imageOverride?: string;
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

  const inscriptionsProgram = getProgramInstanceInscriptions(
    connection,
    wallet
  );

  if (!legacyInscriptionsProgram) {
    throw Error("IDL not ready");
  }

  const { mint, imageOverride } = params;

  const legacySigner = getLegacySignerPda(
    legacyInscriptionsProgram.programId,
    mint
  )[0];


  const blockhash = await connection.getLatestBlockhash();

  const inscription = getInscriptionPda(mint)[0];
  const inscriptionData = getInscriptionDataPda(mint)[0];
  const inscriptionSummary = getInscriptionSummaryPda()[0];
  const inscriptionRanksCurrentPage = getInscriptionRankPda(BigInt(0))[0];
  const inscriptionRanksNextPage = getInscriptionRankPda(BigInt(1))[0];
  const legacyInscription = getLegacyInscriptionPda(mint)[0];
  const legacyMetadata = getLegacyMetadataPda(mint)[0];
  const instructions: TransactionInstruction[] = [];

    console.log({
      legacySigner: legacySigner.toBase58(),
      inscription: inscription.toBase58(),
      inscriptionData: inscriptionData.toBase58(),
      inscriptionSummary: inscriptionSummary.toBase58(),
      inscriptionRanksCurrentPage: inscriptionRanksCurrentPage.toBase58(),
      inscriptionRanksNextPage: inscriptionRanksNextPage.toBase58(),
      legacyInscription: legacyInscription.toBase58(),
      legacyMetadata: legacyMetadata.toBase58()
    })

  let webphash: undefined | string;
  if (imageOverride) {
    const imageBuffer = await getImageAsBuffer(imageOverride);
    webphash = await calculateHashFromBuffer(imageBuffer);
  } else {

    const data = await getLegacyCompressedImage(mint, cluster);
    webphash = data.hash;
    
  }


  console.log('f');
  const ix = await legacyInscriptionsProgram.methods
    .inscribeLegacyMetadataAsUauth(webphash)
    .accounts({
      payer: wallet.publicKey,
      legacySigner,
      mint,
      inscription,
      inscriptionData,
      inscriptionSummary,
      inscriptionRanksCurrentPage,
      inscriptionRanksNextPage,
      legacyInscription,
      legacyMetadata,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      inscriptionsProgram: inscriptionsProgram.programId,
    })
    .instruction();

  instructions.push(ix);
  data.push({
    instructions,
    signers: [],
    signatures: [],
    description: "Inscribe legacy metadata",
    blockhash,
  });
  console.log({ data });

  return {
    data,
  };
};

export const InscribeLegacyMetadataAsUauthTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IInscribeLegacyMint>,
    "transactionGenerator"
  >
) => {
  return (
    <GenericTransactionButton<IInscribeLegacyMint>
      text={`Create inscription`}
      transactionGenerator={inscribeLegacyMint}
      onError={(msg) => notify({ message: msg ?? "Unknown error" })}
      {...props}
    />
  );
};
