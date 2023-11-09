import { allowCors } from "@app/api/middleware/allowCors";
import { HttpMethod, validateApi } from "@app/api/middleware/validateApi";
import {
  DEVNET_URL,
  LEGACY_SIGNER_PRIVATE_KEY,
  LOCALNET_URL,
  MAINNET_URL,
  NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID,
} from "@app/environmentvariables";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import {
  LibreWallet,
  getInscriptionPda,
  getInscriptionRankPda,
  getLegacySignerPda,
  getProgramInstanceInscriptions
} from "@libreplex/shared-ui";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { NextApiHandler } from "next";

import {
  getInscriptionDataPda,
  getInscriptionSummaryPda, getProgramInstanceLegacyInscriptions
} from "@libreplex/shared-ui";
import { getLegacyInscriptionPda } from "@libreplex/shared-ui/src/pdas/getLegacyInscriptionPda";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import joi from "joi";
import { ITransaction } from "../../../../transactions/ITransaction";
import { convertToWebpAndHash } from "@app/utils/webp";

const schema = joi.object({
  legacyMetadataId: joi.string().required(),
  tokenAccountId: joi.string().required(),
  payerId: joi.string().required(),
  ownerId: joi.string().required(),
  cluster: joi.string().required().valid("localnet", "devnet", "mainnet-beta"),
});

const LegacyInscription: NextApiHandler = async (req, res) => {
  const { mintId } = req.query;
  const { cluster, payerId, ownerId, legacyMetadataId, tokenAccountId } =
    req.body;
  try {
    const legacySignerKeypair = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(LEGACY_SIGNER_PRIVATE_KEY))
    );
    console.log({ legacySignerKeypair });

    const libreWallet = new LibreWallet(legacySignerKeypair);
    const connectionUrl =
      cluster === "localnet"
        ? LOCALNET_URL
        : cluster === "mainnet-beta"
        ? MAINNET_URL
        : DEVNET_URL;
    console.log({ connectionUrl });
    const connection = new Connection(connectionUrl);

    console.log({ NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID });

    const inscriptionsProgram = getProgramInstanceInscriptions(
      connection,
      libreWallet
    );

    const legacyInscriptionsProgram = getProgramInstanceLegacyInscriptions(
      new PublicKey(NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID),
      connection,
      libreWallet
    );
    const payer = new PublicKey(payerId);
    const mint = new PublicKey(mintId);
    const owner = new PublicKey(ownerId);
    const tokenAccount = new PublicKey(tokenAccountId);
    const legacyMetadata = new PublicKey(legacyMetadataId);
    const authority = legacySignerKeypair.publicKey;


    const metadata = await connection.getAccountInfo(legacyMetadata);

    const metadataObj = Metadata.deserialize(metadata.data)[0];

    const { webpHash, webpBuffer } = await convertToWebpAndHash(metadataObj.data.uri);

    const inscription = getInscriptionPda(mint)[0];

    const inscriptionData = getInscriptionDataPda(mint)[0];

    console.log({ inscriptionData });

    const inscriptionSummary = getInscriptionSummaryPda()[0];

    const inscriptionRanksCurrentPage = getInscriptionRankPda(
      BigInt(0) // TODO: Make dynamic when pages swap
    )[0];

    const inscriptionRanksNextPage = getInscriptionRankPda(
      BigInt(1) // TODO: Make dynamic when pages swap
    )[0];

    const legacyInscription = getLegacyInscriptionPda(mint)[0];

    const legacySigner = getLegacySignerPda(
      legacyInscriptionsProgram.programId,
      mint
    )[0];

    const ix = await legacyInscriptionsProgram.methods
      .inscribeLegacyMetadataAsHolder(webpHash)
      .accounts({
        payer,
        secondSignature: legacySignerKeypair.publicKey,
        legacySigner,
        owner,
        mint,
        inscription,
        inscriptionData,
        inscriptionSummary,
        inscriptionRanksCurrentPage,
        inscriptionRanksNextPage,
        legacyInscription,

        tokenAccount,

        legacyMetadata,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        inscriptionsProgram: inscriptionsProgram.programId,
      })
      .instruction();

    console.log("get blockhash");
    const blockhash = await connection.getLatestBlockhash();
    console.log("Got blockhash");
    const transaction = new Transaction();
    transaction.feePayer = new PublicKey(payer);
    transaction.recentBlockhash = blockhash.blockhash;
    transaction.add(
      // ixRankPageCurrent, ixRankPageNext,
      ix
    );
    // confirms the validation hash
    transaction.partialSign(legacySignerKeypair);
    const retval: ITransaction = {
      partiallySignedTxs: [
        {
          blockhash,
          buffer: [...transaction.serialize({ verifySignatures: false })],
          signatures: transaction.signatures
            .filter((signature) => signature.signature)
            .map((signature) => ({
              signature: [...signature.signature!],
              pubkey: signature.publicKey.toBase58(),
            })),
        },
      ],
    };

    return res.status(200).json(retval);
  } catch (e) {
    console.log({ e });
    return res.status(500).json({
      msg: "Not an inscription",
    });
  }
};

export default allowCors(
  validateApi({
    [HttpMethod.POST]: { body: schema },
  })(LegacyInscription)
);
