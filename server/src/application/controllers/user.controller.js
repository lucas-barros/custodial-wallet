export const createUserController = ({
  UserEntity,
  userRepository,
  bitcoinService,
  hashService,
}) => {
  return {
    create: async (req, res) => {
      const { email, password, name } = req.body;
      const btcAddress = await bitcoinService.generateAddress();
      const hashedPassword = await hashService.hash(password);
      const userEntityresult = await UserEntity.create({
        email,
        password: hashedPassword,
        name,
        btcAddress,
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

      res.status(201).send({ userId: userRepositoryResult.val.id });
    },
    getById: async (req, res) => {
      const userId = req.params.id;
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
  };
};
