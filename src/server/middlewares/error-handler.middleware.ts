import { NextFunction, Response } from "express";
import { CustomError } from "../services/error.service";
import { IRequest } from "../types/express";

export const apiErrorHandler = (
  err: CustomError,
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  const response = {
    code: err.statusCode,
    message: err.message,
  };

  res.status(err.statusCode);
  res.send(response);
};

