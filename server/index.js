import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { router as userRouter } from "./src/application/router/user.router.js";
import { router as plaidRouter } from "./src/application/router/plaid.router.js";
import { router as rateRouter } from "./src/application/router/rate.router.js";
import { router as authRouter } from "./src/application/router/auth.router.js";
import { createContainer } from "./container.js";
import { safeExit } from "./util.js";

const container = createContainer();
const swaggerDocument = YAML.load("./api-spec.yaml");
const PORT = process.env.SERVER_PORT || 8080;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", authRouter(container));
app.use("/users", userRouter(container));
app.use("/plaid", plaidRouter(container));
app.use("/rate", rateRouter(container));

container.bitcoinService.loadWallet();

const server = app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});

process.on("SIGTERM", () => {
  safeExit(server, container.bitcoinService);
});

process.on("uncaughtException", (error) => {
  console.error(error);
  safeExit(server, container.bitcoinService);
});
