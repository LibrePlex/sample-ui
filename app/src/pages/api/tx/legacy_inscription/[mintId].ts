import { HttpMethod, validateApi } from "@app/api/middleware/validateApi";
import { allowCors } from "@app/api/middleware/allowCors";
import {
  DEVNET_URL,
  LEGACY_SIGNER_PRIVATE_KEY,
  LOCALNET_URL,
  MAINNET_URL,
  NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID,
} from "@app/environmentvariables";
import {
  LibreWallet,
  PROGRAM_ID_INSCRIPTIONS,
  getInscriptionPda,
  getInscriptionRankPda,
} from "@libreplex/shared-ui";
import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { NextApiHandler } from "next";

import joi from "joi";
import { getProgramInstanceLegacyInscriptions } from "@libreplex/shared-ui";
import { getInscriptionDataPda, getInscriptionSummaryPda } from "@libreplex/shared-ui";
import { getLegacyInscriptionPda } from "@libreplex/shared-ui/src/pdas/getLegacyInscriptionPda";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const schema = joi.object({
  legacyMetadataId: joi.string().required(),
  tokenAccountId: joi.string().required(),
  payerId: joi.string().required(),
  ownerId: joi.string().required(),
  cluster: joi.string().required().valid("localnet", "devnet", "mainnet-beta"),
});

const LegacyInscription: NextApiHandler = async (req, res) => {
  const { mintId } = req.query;
  const {cluster, payerId, ownerId, legacyMetadataId} = req.body;

  console.log(LEGACY_SIGNER_PRIVATE_KEY);
  const legacySignerKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(LEGACY_SIGNER_PRIVATE_KEY))
  );
  console.log({ legacySignerKeypair });

  const libreWallet = new LibreWallet(legacySignerKeypair);

  const connection = new Connection(
    cluster === "localnet"
      ? LOCALNET_URL
      : cluster === "mainnet-beta"
      ? MAINNET_URL
      : DEVNET_URL
  );

console.log({NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID});

  const legacyInscriptionsProgram = getProgramInstanceLegacyInscriptions(
    new PublicKey(NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID),
    connection,
    libreWallet
  );
    console.log({payerId, mintId})
  const payer = new PublicKey(payerId);
  const mint = new PublicKey(mintId);
  const owner = new PublicKey(ownerId);
  const legacyMetadata = new PublicKey(legacyMetadataId);

  const inscription = getInscriptionPda(
    new PublicKey(PROGRAM_ID_INSCRIPTIONS),
    mint
  )[0];

  const inscriptionData = getInscriptionDataPda(
    new PublicKey(PROGRAM_ID_INSCRIPTIONS),
    mint
  )[0];

  const inscriptionSummary = getInscriptionSummaryPda(
    new PublicKey(PROGRAM_ID_INSCRIPTIONS),
    mint
  )[0];

  const inscriptionRanksCurrentPage = getInscriptionRankPda(
    new PublicKey(PROGRAM_ID_INSCRIPTIONS),
    BigInt(0) // TODO: Make dynamic when pages swap
  )[0];

  const inscriptionRanksNextPage = getInscriptionRankPda(
    new PublicKey(PROGRAM_ID_INSCRIPTIONS),
    BigInt(1) // TODO: Make dynamic when pages swap
  )[0];

  const inscriptionsProgram = new PublicKey(NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID);
  const legacyInscription = getLegacyInscriptionPda(
    inscriptionsProgram,
    mint
  )[0];

  const a = await legacyInscriptionsProgram.methods
    .inscribeLegacyMetadata(
      {
        holder: {},
      },
      "asdfasdf"
    )
    .accounts({
      payer,
      authority: legacySignerKeypair.publicKey,
      owner,
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
      inscriptionsProgram
    })
    .instruction();

    console.log({a});

  return res.status(500).json({
    msg: "Not an inscription",
  });
};

export default allowCors(
  validateApi({
    [HttpMethod.POST]: { body: schema },
  })(LegacyInscription)
);
