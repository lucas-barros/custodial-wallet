import { UserEntity } from "../../domain/entities/user.entity.js";

export const createPlaidController = ({
  plaidService,
  userRepository,
}) => {
  return {
    createLinkToken: async (req, res) => {
      const { userId } = req;

      const { ok, val } = await plaidService.createLinkToken(userId);

      if (!ok) {
        res.status(400).send();
        return;
      }
      res.status(200).send(val);
    },
    setAccessToken: async (req, res) => {
      const { userId } = req;
      const { publicToken } = req.body;
      const accessToken = await plaidService.setAccessToken(publicToken);
      const result = await userRepository.setPlaidToken(userId, accessToken);

      if (!result.ok) {
        res.status(400).send(result.err);
        return;
      }

      res.status(200).send({ success: true });
    },
    getAccounts: async (req, res) => {
      const { userId } = req;
      const userRepositoryResult = await userRepository.getById(userId);

      if (!userRepositoryResult.ok) {
        res.status(400).send(userRepositoryResult.err);
        return;
      }

      const { val: userEntity } = UserEntity.create(userRepositoryResult.val);

      const balance = await plaidService.getAccounts(
        userEntity.getPlaidAccessToken()
      );

      res.status(200).send(balance);
    },
  };
};
