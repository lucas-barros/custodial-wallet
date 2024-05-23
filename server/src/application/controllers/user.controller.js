import { UserEntity } from "../../domain/entities/user.entity.js";
import { BuyBtcUseCase } from "../use-cases/buy-btc.usecase.js";
import { CreateUserUseCase } from "../use-cases/create-user.usecase.js";
import { GetBtcAccountUseCase } from "../use-cases/get-btc-account.usecase.js";
import { GetUserUseCase } from "../use-cases/get-user.usecase.js";
import { SignInUseCase } from "../use-cases/sign-in.usecase.js";

export const createUserController = ({
  userRepository,
  hashService,
  keysService,
  bitcoinService,
  exchangeRateService,
  plaidService,
  authTokenService,
}) => {
  return {
    create: async (req, res) => {
      const { email, password, name } = req.body;

      const createUserUseCase = new CreateUserUseCase({
        hashService,
        keysService,
        userRepository,
        authTokenService,
      });

      const result = await createUserUseCase.execute({ email, password, name });

      if (result.err) {
        res.status(400).send(result.err);
        return;
      }

      res.status(201).send(result.val);
    },
    signIn: async (req, res) => {
      const { email, password } = req.body;

      const signInUseCase = new SignInUseCase({
        hashService,
        userRepository,
        authTokenService,
      });

      const result = await signInUseCase.execute({ email, password });

      if (result.err) {
        res.status(400).send(result.err);
        return;
      }

      res.status(200).send(result.val);
    },
    getById: async (req, res) => {
      const { userId } = req;

      const getUserUseCase = new GetUserUseCase({
        userRepository,
      });

      const result = await getUserUseCase.execute(userId);

      if (result.err) {
        res.status(400).send(result.err);
        return;
      }

      res.status(200).send(result.val);
    },
    getBtcAccount: async (req, res) => {
      const { userId } = req;

      const getBtcAccountUseCase = new GetBtcAccountUseCase({
        userRepository,
        bitcoinService,
      });

      const result = await getBtcAccountUseCase.execute(userId);

      if (result.err) {
        res.status(400).send(result.err);
        return;
      }

      res.status(200).send(result.val);
    },
    buyBtc: async (req, res) => {
      const { userId } = req;
      const { fiatAmount, fiatAccountId } = req.body;
      const buyBtcUseCase = new BuyBtcUseCase({
        userRepository,
        bitcoinService,
        exchangeRateService,
        plaidService,
      });

      const result = await buyBtcUseCase.execute({
        userId,
        fiatAmount,
        fiatAccountId,
      });

      if (result.err) {
        res.status(400).send(result.err);
        return;
      }

      res.status(200).send(result.val);
    },
  };
};
