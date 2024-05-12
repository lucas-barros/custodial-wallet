import BitcoinClient from "bitcoin-core";
import { UserEntity } from "./src/domain/entities/user.entity.js";
import { UserRepository } from "./src/domain/repositories/user.repository.js";
import { SequelizeUser } from "./src/infrastructure/database/models/user.model.js";
import { BitcoinService } from "./src/application/services/bitcoin.service.js";

export const createContainer = () => {
  const bitcoinClient = new BitcoinClient({
    port: process.env.BITCOIN_PORT,
    host: process.env.BITCOIN_HOST,
    network: "regtest",
    username: process.env.BITCOIN_USER,
    password: process.env.BITCOIN_PASSWORD,
  });
  const bitcoinService = new BitcoinService(
    bitcoinClient,
    process.env.WALLET_NAME
  );
  const userRepository = new UserRepository(SequelizeUser);

  return {
    bitcoinService,
    userRepository,
    UserEntity,
  };
};
