import cors from "cors";
import express, { NextFunction, Response } from "express";
import { v7 as uuidv7 } from "uuid";

import route from "./routes";
import { IRequest } from "./types/express";

import { apiErrorHandler } from "./middlewares/error-handler.middleware";
import { appLogInfoMiddleware } from "./middlewares/logger.middleware";

export const init = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use((req: IRequest, res: Response, next: NextFunction) => {
    req.requestId = uuidv7();
    next();
  });

  app.use(appLogInfoMiddleware);
  app.use("/", route);
  app.use(apiErrorHandler);
  return app;
};

