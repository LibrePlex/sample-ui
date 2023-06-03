
import { NextApiRequest, NextApiResponse } from "next";
import { SystemUser, WalletUser, validateAuthenticatedWallet } from "./validateAuthenticatedWallet";
import { validateApi, HttpMethod } from "./validateApi";
import { throttler } from "./throttler";
import { applyMiddleware } from "./applyMiddleware";
import { getRateLimitMiddlewares } from "./getRateLimitMiddlewares";

const middlewares = getRateLimitMiddlewares({
    limit: 10,
    delayAfter: 500,
    windowMs: 10000,
    delayMs: 500,
  }).map(applyMiddleware);
  
  export const defaultAuthenticatedHandler = (
    handler: (req: NextApiRequest, res: NextApiResponse, user: WalletUser | SystemUser) => any
  ) => {
    return validateApi({
      [HttpMethod.GET]: {},
    })(
      throttler(
        middlewares,
        validateAuthenticatedWallet(handler, [HttpMethod.GET])
      )
    );
  };
  