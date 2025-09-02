
import route from "./routes";

import { apiErrorHandler } from "./middlewares/error-handler.middleware";
import { appLogInfoMiddleware } from "./middlewares/logger.middleware";

const server = {
  route,
  apiErrorHandler,
  appLogInfoMiddleware
}

export default server;

