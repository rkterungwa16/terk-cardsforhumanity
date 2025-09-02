import cors from "cors";
import path from "path";
// import hbs from "hbs";
import express, { NextFunction, Response, Request } from "express";
import compression from "compression";
import { v7 as uuidv7 } from "uuid";

import { IRequest } from "./server/types/express";
import server from "./server/";
import { ssrMiddleware } from "./server/ssr";

// For production, use the built client assets
// For development, this should be pointing to where Vite builds the client

const { route, apiErrorHandler, appLogInfoMiddleware } = server;

const rootPath = path.normalize(`${__dirname}/../`);

export const init = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  // app.set("views", `${__dirname}/server/views`);
  // app.set("view engine", "hbs");
  app.use(compression());
  // Static files will be served later in the middleware chain
  // hbs.registerPartials(`${__dirname}/server/views/partials`);

  app.use((req: IRequest, res: Response, next: NextFunction) => {
    req.requestId = uuidv7();
    next();
  });

  app.use(appLogInfoMiddleware);

  // API routes should be handled before SSR
  app.use("/api", route);

  // Serve static assets
  app.use(
    express.static(`${rootPath}/dist/client`, {
      index: false, // Don't serve index.html for / automatically
    }),
  );

  // Handle all other routes with SSR
  app.use("*", ssrMiddleware);

  // Error handler should be last
  app.use(apiErrorHandler);

  return app;
};
