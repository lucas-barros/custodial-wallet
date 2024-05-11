export const createUserController = ({ UserEntity, UserRepository }) => {
  return {
    create: async (req, res) => {
      const { email, password, name } = req.body;
      const userEntityresult = UserEntity.create({ email, password, name });
      if (!userEntityresult.ok) {
        res.status(400).send(userEntityresult.err);
        return;
      }

      const userRepositoryResult = await UserRepository.create(
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
      const userRepositoryResult = await UserRepository.getById(userId);
      if (!userEntityresult.ok) {
        res.status(400).send(userRepositoryResult.err);
        return;
      }

      const userEntityresult = UserEntity.create(userRepositoryResult.val);

      res.status(200).send({
        name: userEntityresult.val.getName(),
        email: userEntityresult.val.getEmail(),
        btcAddress: userEntityresult.val.getBtcAddress(),
      });
    },
  };
};
