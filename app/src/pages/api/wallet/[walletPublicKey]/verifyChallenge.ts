import {
    COOKIE_KEY_AUTH,
    JWT_SYSTEM_SIGNING_KEY,
  } from "@app/environmentvariables";
  
  import bs58 from "bs58";
  import joi from "joi";
  import jwt from "jsonwebtoken";
  import { NextApiRequest, NextApiResponse } from "next";
  import nacl from "tweetnacl";
  import Cookies from "cookies";
  
  
  
  import Debug from "debug";
import { ApiErrors } from "@app/pages/api/ApiErrors";
import { getAuthenticationMessage } from "./createChallenge";
import {HttpMethod, validateApi} from "@app/api/middleware/validateApi";
  
  const debug = Debug("api:authenticatedwallet");
  
  const schema = joi.object({
    token: joi.string().required(),
    signature: joi.array().items(joi.number().required()),
  });
  
  const AUTH_EXPIRY_IN_SECONDS = 60 * 60 * 1; /// 1 hour
  
  export const verifyChallenge = async (
    req: NextApiRequest,
    res: NextApiResponse
  ) => {
    const { token, signature } = req.body as {
      token: string;
      signature: string;
    } as { token: string; signature: string };
    /// do we have an existing cookie?
  
    /// JWT verification handles expiry of auth tokens
    debug({ token, JWT_SYSTEM_SIGNING_KEY });
    try {
      const decodedNonce = jwt.verify(token, JWT_SYSTEM_SIGNING_KEY);
  
      const decoded = jwt.decode(token, { complete: true });
      console.log({ decoded });
      if (decoded?.header.alg !== "HS256" || decoded.header.typ !== "JWT") {
        res.status(403).json({
          message: "Bad algo",
          code: ApiErrors.FORBIDDEN,
        });
        return;
      }
  
      const { walletPublicKey } = req.query as { walletPublicKey: string };
      const { nonce } = decodedNonce as { nonce: string; w: string };
  
      const msg = getAuthenticationMessage(nonce);
  
      console.log({msg});
      //
      // recreate the message from the nonce
      const messageBytes = new TextEncoder().encode(
        getAuthenticationMessage(nonce)
      );
  
      const publicKeyBytes = bs58.decode(walletPublicKey);
      const signatureBytes = Buffer.from(signature);
  
      console.log({publicKeyBytes, signatureBytes})
  
      /// verify they've signed the correct message
      const result = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes
      );
  
      if (!result) {
        return res.status(403).json({
          message: "Authentication failed",
          code: ApiErrors.FORBIDDEN,
        });
      }
  
      const signedAuth = jwt.sign(
        {
          w: walletPublicKey,
        },
        JWT_SYSTEM_SIGNING_KEY,
        {
          expiresIn: `${AUTH_EXPIRY_IN_SECONDS}s`,
        }
      );
  
      const cookies = new Cookies(req, res);
      cookies.set(COOKIE_KEY_AUTH, signedAuth, {
        maxAge: AUTH_EXPIRY_IN_SECONDS * 1000, /// in ms
      });
      return res.status(200).json({
        verified: true,
      });
    } catch (e) {
      console.log(e);
      return  res.status(403).json({
        message: "Authentication failed",
        code: ApiErrors.FORBIDDEN,
      });
    }
  };
  
  export default validateApi({
    [HttpMethod.POST]: { body: schema },
  })(verifyChallenge);
  