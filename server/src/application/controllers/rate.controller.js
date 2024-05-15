export const createRateController = ({ exchangeRateService }) => {
  return {
    getBtcInUsd: async (req, res) => {
      const btcInUsd = await exchangeRateService.getBtcInUsd();

      res.status(200).send({ rate: btcInUsd });
    },
  };
};
