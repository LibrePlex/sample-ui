
import Cookies from "cookies";
import Debug from "debug";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

import {
  COOKIE_KEY_AUTH,
  JWT_SYSTEM_SIGNING_KEY,
} from "@/environmentvariables";


import jwtDecode from "jsonwebtoken";
import { HttpMethod } from "./validateApi";
import { ApiErrors } from "@/pages/api/ApiErrors";

const debug = Debug("lister:api:middleware");

export class WalletUser {
  public readonly walletId: string;
  constructor(walletId: string) {
    this.walletId = walletId;
  }
}

export class SystemUser {}

export const validateAuthenticatedWallet = (
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    user: SystemUser | WalletUser
  ) => unknown | Promise<unknown>,
  methods: HttpMethod[],
  defaultHandler?: (
    req: NextApiRequest,
    res: NextApiResponse
  ) => unknown | Promise<unknown>
): NextApiHandler => {
  const wrappedHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      let handleMethod: boolean = false;
      for (const method of methods) {
        if (method === req.method) {
          handleMethod = true;
          break;
        }
      }
      if (!handleMethod) {
        if (defaultHandler) {
          return defaultHandler(req, res);
        } else {
          return res.status(401).json({
            error: {
              msg: `Wallet not authenticated`,
              code: ApiErrors.NOT_AUTHENTICATED,
            },
          });
        }
      }

      const cookies = new Cookies(req, res);
      const signedAuth = cookies.get(COOKIE_KEY_AUTH);
      if (!signedAuth) {
        return res.status(401).json({
          error: {
            msg: `Wallet not authenticated`,
            code: ApiErrors.NOT_AUTHENTICATED,
          },
        });
      }
      const decodedToken = jwtDecode.verify(signedAuth, JWT_SYSTEM_SIGNING_KEY);
      if (!decodedToken) {
        return res.status(401).json({
          error: {
            msg: `Could not decode signedAuth`,
            code: ApiErrors.NOT_AUTHENTICATED,
          },
        });
      }
      debug({ decodedToken, signedAuth });
      const { w } = decodedToken as {
        w: string | undefined;
      };

      if (!w) {
        return res.status(403).json({
          error: {
            msg: `No wallet authenticated`,
            code: ApiErrors.FORBIDDEN,
          },
        });
      }

      return handler(req, res, new WalletUser(w));
    } catch (e) {
      console.log(e);
      return res.status(403).json({
        error: {
          msg: `No wallet authenticated`,
          code: ApiErrors.FORBIDDEN,
        },
      });
    }
  };
  return wrappedHandler;
};
