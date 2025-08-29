import cors from "cors";
import path from "path";
import hbs from "hbs";
import express, { NextFunction, Response } from "express";
import { v7 as uuidv7 } from "uuid";

import route from "./server/routes";
import { IRequest } from "./server/types/express";

import { apiErrorHandler } from "./server/middlewares/error-handler.middleware";
import { appLogInfoMiddleware } from "./server/middlewares/logger.middleware";

export const init = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.set("views", `${__dirname}/server/views`);
  app.set("view engine", "hbs");
  // app.use(express.static(`${__dirname}/client`));
  hbs.registerPartials(`${__dirname}/server/views/partials`);

  app.use((req: IRequest, res: Response, next: NextFunction) => {
    req.requestId = uuidv7();
    next();
  });

  app.use(appLogInfoMiddleware);
  app.use("/", route);
  app.use(apiErrorHandler);
  return app;
};

