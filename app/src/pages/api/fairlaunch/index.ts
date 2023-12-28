import { NextApiHandler } from "next";
import joi from "joi";
import { getRateLimitMiddlewares } from "@app/api/middleware/getRateLimitMiddlewares";
import { applyMiddleware } from "@app/api/middleware/applyMiddleware";
import { HttpClient } from "@libreplex/shared-ui";
import { allowCors } from "@app/api/middleware/allowCors";
import {HttpMethod, validateApi} from "@app/api/middleware/validateApi";
import { throttler } from "@app/api/middleware/throttler";



export interface IGetFairLaunches {
  ticker: String;
}

const schema = joi.object({
  ticker: joi.string().allow(''),
});

// this can kill CPU usage so apply throttling. max 2 calls / 10s
const middlewares = getRateLimitMiddlewares({
  limit: 3,
  windowMs: 1500, // there's a 500ms delay in the UI to make sure this doesn't get spammed
}).map(applyMiddleware);

export interface IFairLaunchDeploymentIndexed {
  ticker: string;
  tokens_minted: number;
  added_at: number;
  max_number_of_tokens: number;
}

const FetchFairLaunches: NextApiHandler = async (req, res) => {
  const { ticker } = req.body as IGetFairLaunches;
  console.log({ ticker });
  try {
    const httpClient = new HttpClient("");

    const { data, error } = await httpClient.get<IFairLaunchDeploymentIndexed[]>(
      "https://ticker.pinit.io/all",
      {
        headers: {
          Authorization: process.env.PINIT_TICKER_AUTH_STRING,
        },
      }
    );

    if (data) {
      return res
        .status(200)
        .json(
          data.filter(
            (item) =>
              !ticker ||
              item.ticker.toLowerCase().indexOf(ticker.toLowerCase()) > -1
          )
        );
    } else {
      console.log(error);
      throw Error("Could not fetch");
    }
  } catch (e) {
    console.log({ e });
    return res.status(500).json({
      msg: "Could not fetch fair launches",
    });
  }
};

export default allowCors(
  validateApi({
    [HttpMethod.POST]: { body: schema },
  })(throttler(middlewares, FetchFairLaunches))
);
