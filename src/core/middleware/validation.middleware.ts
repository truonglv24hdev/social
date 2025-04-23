import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { HttpException } from "../exceptions";

const validatorMiddleware = (
  type: any,
  skipMissingProperties = false
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    validate(plainToInstance(type, req.body), { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) => {
              return Object.values(error.constraints!);
            })
            .join(",");
          return next(new HttpException(400, message));
        }
        next();
      }
    );
  };
};

export default validatorMiddleware;
