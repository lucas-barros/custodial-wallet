require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./src/models");
const Client = require("bitcoin-core");
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

client.command("loadwallet", "foobar").then((response) => {
  console.log("Wallet:", response);

  client
    .getBalance("*", 0)
    .then((help) => console.log(help))
    .catch(console.log);
});

app.get("/", function (req, res) {
  res.json({ hello: "world" });
});

app.listen(PORT, function () {
  console.log("Example app listening on port 8080!");
});
