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
  getLegacySignerPda,
  getProgramInstanceInscriptions,
} from "@libreplex/shared-ui";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { NextApiHandler } from "next";

import joi from "joi";
import { getProgramInstanceLegacyInscriptions } from "@libreplex/shared-ui";
import {
  getInscriptionDataPda,
  getInscriptionSummaryPda,
} from "@libreplex/shared-ui";
import { getLegacyInscriptionPda } from "@libreplex/shared-ui/src/pdas/getLegacyInscriptionPda";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ITransaction } from "../../../../transactions/ITransaction";
import { connect } from "http2";

const schema = joi.object({
  legacyMetadataId: joi.string().required(),
  tokenAccountId: joi.string().required(),
  payerId: joi.string().required(),
  ownerId: joi.string().required(),
  cluster: joi.string().required().valid("localnet", "devnet", "mainnet-beta"),
});

const LegacyInscription: NextApiHandler = async (req, res) => {
  const { mintId } = req.query;
  const { cluster, payerId, ownerId, legacyMetadataId, tokenAccountId } = req.body;
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

    const inscriptionsProgram = getProgramInstanceInscriptions(connection, libreWallet);

    const legacyInscriptionsProgram = getProgramInstanceLegacyInscriptions(
      new PublicKey(NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID),
      connection,
      libreWallet
    );
    const payer = new PublicKey(payerId);
    const mint = new PublicKey(mintId);
    const owner = new PublicKey(ownerId);
    const tokenAccount = new PublicKey(tokenAccountId)
    const legacyMetadata = new PublicKey(legacyMetadataId);
    const authority = legacySignerKeypair.publicKey;
    
    const inscription = getInscriptionPda(
      mint
    )[0];

    const inscriptionData = getInscriptionDataPda(
      mint
    )[0];

    console.log({ inscriptionData });

    const inscriptionSummary = getInscriptionSummaryPda()[0];

    const inscriptionRanksCurrentPage = getInscriptionRankPda(
      BigInt(0) // TODO: Make dynamic when pages swap
    )[0];

    const inscriptionRanksNextPage = getInscriptionRankPda(
      BigInt(1) // TODO: Make dynamic when pages swap
    )[0];

    
    const legacyInscription = getLegacyInscriptionPda(
      mint
    )[0];

    const legacySigner = 
    getLegacySignerPda(
      legacyInscriptionsProgram.programId,
      mint
    )[0];

    console.log("Building a transaction", {
      payer: payer.toBase58(),
      authority: authority.toBase58(),
      legacySigner: legacySigner.toBase58()
    });

    // need to improve the handling of the creation of rank pages.
    // for now these are always prefixed to inscription create methods.
    // under the hood they use init_if_needed so they're idempotent
    // but it's wasted compute budget 
    // const ixRankPageCurrent = await inscriptionsProgram.methods.createInscriptionRankPage({pageIndex: 0}).accounts({
    //   payer,
    //   page: inscriptionRanksCurrentPage,
    //   systemProgram: SystemProgram.programId
    // }).instruction();

    // const ixRankPageNext = await inscriptionsProgram.methods.createInscriptionRankPage({pageIndex: 1}).accounts({
    //   payer,
    //   page: inscriptionRanksNextPage,
    //   systemProgram: SystemProgram.programId
    // }).instruction();
    const ix = await legacyInscriptionsProgram.methods
      .inscribeLegacyMetadataAsHolder(
        "asdfasdf"
      )
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
      ix);
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
    console.log({e});
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
