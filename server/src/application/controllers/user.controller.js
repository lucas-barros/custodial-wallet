export const createUserController = ({
  UserEntity,
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
      const { publicAddress, encryptedPrivateKey } =
        await keysService.createKeys();
      const hashedPassword = await hashService.hash(password);
      const userEntityresult = await UserEntity.create({
        email,
        password: hashedPassword,
        name,
        btcAddress: publicAddress,
        encryptedPrivateKey,
      });
      if (!userEntityresult.ok) {
        res.status(400).send(userEntityresult.err);
        return;
      }

      const userRepositoryResult = await userRepository.create(
        userEntityresult.val
      );
      if (!userRepositoryResult.ok) {
        res.status(400).send(userRepositoryResult.err);
        return;
      }
      const userId = userRepositoryResult.val.id;

      const { val: token } = authTokenService.sign({ userId });

      res.status(201).send(token);
    },
    signIn: async (req, res) => {
      const { email, password } = req.body;
      const userRepositoryResult = await userRepository.getByEmail(email);
      if (!userRepositoryResult.ok) {
        res.status(400).send(userRepositoryResult.err);
        return;
      }
      const userEntityresult = UserEntity.create(userRepositoryResult.val);
      const isValid = await hashService.compare(
        password,
        userEntityresult.val.getPassword()
      );

      if (!isValid) {
        res.status(401).send();
        return;
      }

      const userId = userEntityresult.val.getUserId();
      const { val: token } = authTokenService.sign({ userId });

      res.status(200).send(token);
    },
    getById: async (req, res) => {
      const { userId } = req;
      const userRepositoryResult = await userRepository.getById(userId);
      if (!userRepositoryResult.ok) {
        res.status(400).send(userRepositoryResult.err);
        return;
      }
      const userEntityresult = UserEntity.create(userRepositoryResult.val);
      res.status(200).send({
        id: userId,
        name: userEntityresult.val.getName(),
        email: userEntityresult.val.getEmail(),
        btcAddress: userEntityresult.val.getBtcAddress(),
        isPlaidConnected: Boolean(userEntityresult.val.getPlaidAccessToken()),
      });
    },
    getBtcAccount: async (req, res) => {
      const { userId } = req;
      const userRepositoryResult = await userRepository.getById(userId);
      if (!userRepositoryResult.ok) {
        res.status(400).send(userRepositoryResult.err);
        return;
      }
      const userEntityresult = UserEntity.create(userRepositoryResult.val);
      const btcAddress = userEntityresult.val.getBtcAddress();
      const balance = await bitcoinService.getExtBalance(btcAddress);
      res.status(200).send({
        btcAddress,
        balance,
      });
    },
    buyBtc: async (req, res) => {
      const { userId } = req;
      const { fiatAmount, fiatAccountId } = req.body;
      const userRepositoryResult = await userRepository.getById(userId);
      if (!userRepositoryResult.ok) {
        res.status(400).send(userRepositoryResult.err);
        return;
      }
      const userEntity = UserEntity.create(userRepositoryResult.val).val;
      const btcAddress = userEntity.getBtcAddress();
      const btcInUsd = await exchangeRateService.getBtcInUsd();
      const fiatAccounts = await plaidService.getAccounts(
        userEntity.getPlaidAccessToken()
      );
      const fiatAccount = fiatAccounts.find(
        (fiatAccount) => fiatAccount.id === fiatAccountId
      );

      if (!fiatAccount) {
        res.status(400).send({ error: "Fiat account does not exit" });
        return;
      }

      if (!btcInUsd) {
        res.status(400).send({ error: "Exhange rate not available" });
        return;
      }

      if (Number(fiatAccount.balance) < Number(fiatAmount)) {
        res.status(400).send({ error: "Not enough balance" });
        return;
      }

      const btcAmount = Number(fiatAmount) / Number(btcInUsd);
      await bitcoinService.sendCoins(btcAddress, btcAmount.toFixed(8));
      res.status(200).send({ success: true });
    },
  };
};
