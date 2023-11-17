import { allowCors } from "@app/api/middleware/allowCors";
import { HttpMethod, validateApi } from "@app/api/middleware/validateApi";
import {
  DEVNET_URL,
  LEGACY_SIGNER_PRIVATE_KEY,
  LOCALNET_URL,
  MAINNET_URL,
  NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID,
} from "@app/environmentvariables";
import {
  HttpClient,
  LibreWallet,
  decodeLegacyMetadata,
  getInscriptionPda,
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

import { getInscriptionDataPda, getProgramInstanceLegacyInscriptions } from "@libreplex/shared-ui";
import { getLegacyInscriptionPda } from "@libreplex/shared-ui/src/pdas/getLegacyInscriptionPda";
import joi from "joi";
import { ITransaction } from "../../../../transactions/ITransaction";
import { convertToWebpAndHash } from "@app/utils/webp";

/// we use imagemin to convert images to webp

const schema = joi.object({
  legacyMetadataId: joi.string().required(),
  payerId: joi.string().required(),
  cluster: joi.string().required().valid("localnet", "devnet", "mainnet-beta"),
});

const LegacyInscription: NextApiHandler = async (req, res) => {
  const { mintId } = req.query;
  const { cluster, payerId, legacyMetadataId } = req.body;
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
      connection,
      libreWallet
    );
    const payer = new PublicKey(payerId);
    const mint = new PublicKey(mintId);
    const legacyMetadata = new PublicKey(legacyMetadataId);
    const authority = legacySignerKeypair.publicKey;

    const inscription = getInscriptionPda(mint)[0];

    const inscriptionData = getInscriptionDataPda(mint)[0];

    console.log({ inscriptionData });

    const legacyMetadataAccount = await connection.getAccountInfo(
      legacyMetadata
    );

    const metadata = decodeLegacyMetadata(
      legacyMetadataAccount.data,
      legacyMetadata
    );

    const {webpHash} = await convertToWebpAndHash(
      metadata.item.data.uri
    );

    // now fetch the image

    const legacyInscription = getLegacyInscriptionPda(mint);

    const ix = await legacyInscriptionsProgram.methods
      .setValidationHash(webpHash)
      .accounts({
        payer,
        authority: legacySignerKeypair.publicKey,
        mint,
        inscription,
        legacyInscription,
        legacyMetadata,
        systemProgram: SystemProgram.programId,
        inscriptionsProgram: inscriptionsProgram.programId,
      })
      .instruction();

    const blockhash = await connection.getLatestBlockhash();
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
