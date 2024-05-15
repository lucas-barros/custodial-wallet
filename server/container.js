import BitcoinClient from "bitcoin-core";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { UserEntity } from "./src/domain/entities/user.entity.js";
import { UserRepository } from "./src/domain/repositories/user.repository.js";
import { SequelizeUser } from "./src/infrastructure/database/models/user.model.js";
import { BitcoinService } from "./src/application/services/bitcoin.service.js";
import { PlaidService } from "./src/application/services/plaid.service.js";
import { HashService } from "./src/application/services/hash.service.js";
import { KeysService } from "./src/application/services/keys.service.js";
import { ExchangeRateService } from "./src/application/services/exchage-rate.service.js";
import { AuthTokenService } from "./src/application/services/auth-token.service.js";

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
    process.env.BITCOIN_WALLET_NAME
  );
  const hashService = new HashService();
  const keysService = new KeysService();
  const exchangeRateService = new ExchangeRateService(
    process.env.COIN_GECKO_API_KEY
  );
  const authTokenService = new AuthTokenService(process.env.JWT_SECRET);

  return {
    bitcoinService,
    plaidService,
    hashService,
    keysService,
    exchangeRateService,
    authTokenService,
    userRepository,
    UserEntity,
  };
};
