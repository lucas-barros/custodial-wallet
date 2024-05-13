import BitcoinClient from "bitcoin-core";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { UserEntity } from "./src/domain/entities/user.entity.js";
import { UserRepository } from "./src/domain/repositories/user.repository.js";
import { SequelizeUser } from "./src/infrastructure/database/models/user.model.js";
import { BitcoinService } from "./src/application/services/bitcoin.service.js";
import { PlaidService } from "./src/application/services/plaid.service.js";

export const createContainer = () => {
  const bitcoinClient = new BitcoinClient({
    port: process.env.BITCOIN_PORT,
    host: process.env.BITCOIN_HOST,
    network: "regtest",
    username: process.env.BITCOIN_USER,
    password: process.env.BITCOIN_PASSWORD,
  });
  const plaidConfiguration = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV],
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
        "PLAID-SECRET": process.env.PLAID_SECRET,
        "Plaid-Version": "2020-09-14",
      },
    },
  });
  const plaidClient = new PlaidApi(plaidConfiguration);

  const userRepository = new UserRepository(SequelizeUser);
  const plaidService = new PlaidService(plaidClient, {
    clientName: "Bitcoin wallet",
    products: process.env.PLAID_PRODUCTS.split(","),
    countryCodes: process.env.PLAID_COUNTRY_CODES.split(","),
    language: "en",
  });
  const bitcoinService = new BitcoinService(
    bitcoinClient,
    process.env.WALLET_NAME
  );

  return {
    bitcoinService,
    plaidService,
    userRepository,
    UserEntity,
  };
};
