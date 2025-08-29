import * as dotenv from "dotenv";
import { createAppLogger } from "./server/middlewares/logger.middleware";
import { init } from "./server";

const port = process.env.PORT || 3200;
dotenv.config();
init().listen(port);
const applicationStartLog = createAppLogger("Terk Cards for Humanity");
applicationStartLog.log({
  level: "info",
  message: `Application is starting at port ${port}`,
});
