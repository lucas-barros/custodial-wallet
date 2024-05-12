import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { router as userRouter } from "./src/application/router/user.router.js";
import { createContainer } from "./container.js";

const container = createContainer();
const swaggerDocument = YAML.load("./api-spec.yaml");
const PORT = process.env.SERVER_PORT || 8080;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/users", userRouter(container));

container.bitcoinService.loadWallet();

const server = app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});

process.on("SIGTERM", async () => {
  await container.bitcoinService.unloadWallet();

  server.close((err) => {
    if (err) {
      console.error("server: closed with ERROR", err);
      process.exit(81);
    }
    console.debug("server: closed");
    process.exit();
  });
});
