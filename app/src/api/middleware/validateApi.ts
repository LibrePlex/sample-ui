import Debug from "debug";
import { ValidationError } from "joi";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { Configuration, OnValidationError, ValidableRequestFields, ValidationSchemas } from "next-joi";
const debug = Debug("api:middleware:validation");
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  OPTIONS = "OPTIONS"
}

export const getMethodValidatingHandler = (
  schemasPerMethod: {
    [methodName: string]: ValidationSchemas;
  },
  handler: NextApiHandler
) => {
  const methodValidatingHandler = (
    req: NextApiRequest,
    res: NextApiResponse
  ) => {
    const innerMethodValidatingHandler = (
      req: NextApiRequest,
      res: NextApiResponse
    ) => {
      if (handler) {
        return handler(req, res);
      }
    };

    if (schemasPerMethod[req.method as HttpMethod] !== undefined) {
      debug("Found schema for method ", req.method);
      const schemas = schemasPerMethod[req.method as HttpMethod];
      return withJoi({
        onValidationError: (
          req: NextApiRequest,
          res: NextApiResponse,
          error: ValidationError
        ) => {
          return res.status(400).json({
            error: error.details.map((e) => e.message),
          });
        },
      })(schemas, innerMethodValidatingHandler);
    } else {
      return res.status(400).json({
        error: `Unsupported method ${req.method}`,
      });
    }
    // return innerMethodValidatingHandler(req,)
  };

  return methodValidatingHandler;
};

export type ValidationFunction = (
  schemas: ValidationSchemas,
  handler?: NextApiHandler
) => NextApiHandler

export default function withJoi(config?: Configuration): ValidationFunction {
  const onValidationError: OnValidationError = config ? config.onValidationError :
   (_, res) => {
     res.status(400).end()
   };

  return (schemas, handler) => {
    return (req: NextApiRequest, res: NextApiResponse, next?: NextHandler) => {
      const fields: (keyof ValidableRequestFields)[] = ["body", "headers", "query"];

      const validationError = fields.reduce<ValidationError | undefined>((error, field) => {
        if (undefined !== error) {
          return error;
        }
        const schema = schemas[field];

        return schema && schema.required().validate(req[field]).error;
      }, undefined);

      if (undefined !== validationError) {
        return onValidationError(req, res, validationError);
      }

      if (undefined !== next) {
        return next();
      }

      if (undefined !== handler) {
        return handler(req, res);
      }

      res.status(404).end();
    };
  };
}




export const validateApi = <Req extends unknown>(schemasPerMethod: {
  [method: string]: ValidationSchemas;
}): ((
  handler?: NextApiHandler
) => NextApiHandler ) => {
  const returnFunction = (
    // schemas: ValidationSchemas,
    handler?: NextApiHandler
  ): NextApiHandler => {
    const methodValidatingHandler = (
      req: NextApiRequest,
      res: NextApiResponse
    ) => {
      if (req.method && schemasPerMethod[req.method as string] !== undefined) {
        if (handler) {
          return withJoi({
            onValidationError: (
              req: NextApiRequest,
              res: NextApiResponse,
              error: ValidationError
            ) => {
              return res.status(400).json({
                error: error.details.map((e) => e.message),
              });
            },
          })(schemasPerMethod[req.method as string], handler)(req, res); 
        }
      } else {
        return res.status(400).json({
          error: `Unsupported method ${req.method}`,
        });
      }
    };

    return methodValidatingHandler;
  };
  return returnFunction;
};
