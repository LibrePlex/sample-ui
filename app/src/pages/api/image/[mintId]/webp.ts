import { allowCors } from "@app/api/middleware/allowCors";
import { HttpMethod, validateApi } from "@app/api/middleware/validateApi";
import {
  DEVNET_URL,
  LEGACY_SIGNER_PRIVATE_KEY,
  LOCALNET_URL,
  MAINNET_URL,
} from "@app/environmentvariables";
import { LibreWallet, decodeLegacyMetadata } from "@libreplex/shared-ui";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { NextApiHandler } from "next";
import { getLegacyMetadataPda } from "./../../../../../../shared-ui/src/pdas/getLegacyMetadataPda";

import { convertToWebpAndHash } from "@app/utils/webp";
import joi from "joi";
import { throttler } from "@app/api/middleware/throttler";
import { getRateLimitMiddlewares } from "@app/api/middleware/getRateLimitMiddlewares";
import { applyMiddleware } from "@app/api/middleware/applyMiddleware";

const schema = joi.object({
  cluster: joi.string().required().valid("localnet", "devnet", "mainnet-beta"),
});

// this can kill CPU usage so apply throttling. max 2 calls / 10s
const middlewares = getRateLimitMiddlewares({
  limit: 2,
  delayAfter: 500,
  windowMs: 10000,
  delayMs: 500,
}).map(applyMiddleware);

const CalculateWebHashAndBuffer: NextApiHandler = async (req, res) => {
  const { mintId } = req.query;
  const { cluster } = req.body;
  try {
    const connectionUrl =
      cluster === "localnet"
        ? LOCALNET_URL
        : cluster === "mainnet-beta"
        ? MAINNET_URL
        : DEVNET_URL;

    const connection = new Connection(connectionUrl);

    const legacyMetadataId = getLegacyMetadataPda(new PublicKey(mintId))[0];

    const legacyMetadataAccount = await connection.getAccountInfo(
      legacyMetadataId
    );

    const metadata = decodeLegacyMetadata(
      legacyMetadataAccount.data,
      legacyMetadataId
    );

    const { webpHash, webpBuffer } = await convertToWebpAndHash(
      metadata.item.data.uri
    );
    const retval: IWebHashAndBuffer = {
      buf: [...webpBuffer],
      hash: webpHash,
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
  })(throttler(middlewares, CalculateWebHashAndBuffer))
);
