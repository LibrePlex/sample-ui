import { JWT_SYSTEM_SIGNING_KEY } from "@/environmentvariables";

import Debug from "debug";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import joi from "joi";
const debug = Debug("lister:api");
import crypto from "crypto";

import { validateApi, HttpMethod } from "api/middleware/validateApi";

export const getAuthenticationMessage = (nonce: string) => {
  return `Sign to authenticate your wallet [nonce:${nonce}]`;
};

export const EXPIRY_IN_SECONDS = 120;

export interface IWalletChallenge {
  message: string;
  token: string;
  walletPublicKey: string;
}

export const createChallenge = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { walletPublicKey } = req.query as { walletPublicKey: string };

  let nonce = crypto.randomBytes(16).toString("base64");

  const token = jwt.sign(
    {
      walletPublicKey,
      nonce,
    },
    JWT_SYSTEM_SIGNING_KEY,
    {
      expiresIn: `${EXPIRY_IN_SECONDS}s`, /// keep these short lived as they should get used straight away
    }
  );

  const message = getAuthenticationMessage(nonce);

  res.status(200).json({
    message,
    token, /// JWT encoded nonce
    walletPublicKey,
  } as IWalletChallenge);
};

export default validateApi({
  [HttpMethod.GET]: {},
})(createChallenge);
