import { NextApiRequest, NextApiResponse } from "next";

export const throttler = (
    middlewares: ((request: any, response: any) => Promise<unknown>)[],
    handler: (req: NextApiRequest, res: NextApiResponse) => any
  ) => {
    const wrappedHandler = async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        await Promise.all(middlewares.map((middleware) => middleware(req, res)));
      } catch (e) {
        return (req: NextApiRequest, res: NextApiResponse) => {
          res.status(429).send("Too Many Requests");
        };
      }
  
      return handler(req, res);
    };
    return wrappedHandler;
  };
  