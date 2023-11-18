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

import { notify } from "@libreplex/shared-ui";
import { getProgramInstanceLegacyInscriptions } from "@libreplex/shared-ui";
import { getLegacyInscriptionPda } from "@libreplex/shared-ui";

import { getInscriptionV3Pda } from "@libreplex/shared-ui";

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
    connection,
    wallet
  );

  const inscriptionsProgram = getProgramInstanceInscriptions(
    connection,
    wallet
  );

  if (!legacyInscriptionsProgram || !inscriptionsProgram) {
    throw Error("IDL not ready");
  }

  const { mint, imageOverride } = params;

  const legacySigner = getLegacySignerPda(
    legacyInscriptionsProgram.programId,
    mint
  )[0];


  const blockhash = await connection.getLatestBlockhash();

  const inscription = getInscriptionPda(mint)[0];
  const inscriptionV2 = getInscriptionV3Pda(mint)[0];
  const inscriptionData = getInscriptionDataPda(mint)[0];
  const inscriptionSummary = getInscriptionSummaryPda()[0];
  const inscriptionRanksCurrentPage = getInscriptionRankPda(BigInt(0))[0];
  const inscriptionRanksNextPage = getInscriptionRankPda(BigInt(1))[0];
  const legacyInscription = getLegacyInscriptionPda(mint);
  const legacyMetadata = getLegacyMetadataPda(mint)[0];
  const instructions: TransactionInstruction[] = [];

    console.log({
      // legacySigner: legacySigner.toBase58(),
      inscription: inscription.toBase58(),
      inscriptionData: inscriptionData.toBase58(),
      inscriptionSummary: inscriptionSummary.toBase58(),
      inscriptionRanksCurrentPage: inscriptionRanksCurrentPage.toBase58(),
      inscriptionRanksNextPage: inscriptionRanksNextPage.toBase58(),
      legacyMetadata: legacyMetadata.toBase58()
    })

  // let webphash = null; 
  // | string;
  // if (imageOverride) {
  //   const imageBuffer = await getImageAsBuffer(imageOverride);
  //   webphash = await calculateHashFromBuffer(imageBuffer);
  // } else {

  //   const data = await getLegacyCompressedImage(mint, cluster);
  //   webphash = data.hash;
    
  // }


  console.log('f');
  const ix = await legacyInscriptionsProgram.methods
    .inscribeLegacyMetadataAsUauth("")
    .accounts({
      payer: wallet.publicKey,
      legacySigner,
      mint,
      inscription,
      inscriptionV2,
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
      text={`Initialise`}
      transactionGenerator={inscribeLegacyMint}
      onError={(msg) => notify({ message: msg ?? "Unknown error" })}
      {...props}
    />
  );
};
