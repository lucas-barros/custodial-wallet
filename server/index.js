import "dotenv/config";
import express from "express";
import cors from "cors";
import Client from "bitcoin-core";

const client = new Client({
  port: process.env.BITCOIN_PORT,
  host: process.env.BITCOIN_HOST,
  network: "regtest",
  username: process.env.BITCOIN_USER,
  password: process.env.BITCOIN_PASSWORD,
});

const PORT = process.env.SERVER_PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error(error);
    console.error(JSON.stringify(error, null, 4));
  });

client.command("listwalletdir").then(async ({ wallets }) => {
  const isCreated = wallets[0]?.name === process.env.WALLET_NAME;
  if (isCreated) {
    await client.command("loadwallet", process.env.WALLET_NAME);
    console.log("Wallet loaded!");
  } else {
    await client.command("createwallet", process.env.WALLET_NAME, true);
    console.log("Wallet created!");
  }
  const balance = await client.getBalance("*", 0);
  console.log(balance);
});

app.get("/", function (req, res) {
  res.json({ hello: "world" });
});

const server = app.listen(PORT, function () {
  console.log("Example app listening on port 8080!");
});

process.on("SIGTERM", async () => {
  await client.command("unloadwallet", process.env.WALLET_NAME);
  server.close((err) => {
    if (err) {
      console.error("server: closed with ERROR", err);
      process.exit(81);
    }
    console.debug("server: closed");
    process.exit();
  });
});
