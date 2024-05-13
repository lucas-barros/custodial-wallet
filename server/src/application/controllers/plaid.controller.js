export const createPlaidController = ({ plaidService, userRepository }) => {
  return {
    createLinkToken: async (req, res) => {
      const { userId } = req.body;

      const linkToken = await plaidService.createLinkToken(userId);

      res.status(200).send(linkToken);
    },
    setAccessToken: async (req, res) => {
      const { userId, publicToken } = req.body;

      const accessToken = await plaidService.setAccessToken(publicToken);

      const result = await userRepository.setPlaidToken(userId, accessToken);

      if (!result.ok) {
        res.status(400).send(result.err);
        return;
      }

      res.status(200).send({ success: true });
    },
  };
};
