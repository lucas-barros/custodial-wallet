import { jest } from "@jest/globals";
import { createUserController } from "./user.controller";

const mockUserEntity = {
  create: jest.fn(),
};

const mockUserRepository = {
  create: jest.fn(),
  getByEmail: jest.fn(),
  getById: jest.fn(),
};

const mockHashService = {
  hash: jest.fn(),
  compare: jest.fn(),
};

const mockKeysService = {
  createKeys: jest.fn(),
};

const mockBitcoinService = {
  getExtBalance: jest.fn(),
  sendCoins: jest.fn(),
};

const mockExchangeRateService = {
  getBtcInUsd: jest.fn(),
};

const mockPlaidService = {
  getAccounts: jest.fn(),
};

const mockAuthTokenService = {
  sign: jest.fn(),
};

const controller = createUserController({
  UserEntity: mockUserEntity,
  userRepository: mockUserRepository,
  hashService: mockHashService,
  keysService: mockKeysService,
  bitcoinService: mockBitcoinService,
  exchangeRateService: mockExchangeRateService,
  plaidService: mockPlaidService,
  authTokenService: mockAuthTokenService,
});

describe("createUserController", () => {
  describe("buyBtc", () => {
    it("should buy BTC for the user", async () => {
      const req = {
        userId: "userId",
        body: {
          fiatAmount: 100,
          fiatAccountId: "fiatAccountId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      mockUserRepository.getById.mockResolvedValue({
        ok: true,
        val: {
          getPlaidAccessToken: jest.fn().mockReturnValue("plaidToken"),
          getBtcAddress: jest.fn().mockReturnValue("publicAddress"),
        },
      });

      mockUserEntity.create.mockReturnValue({
        val: {
          getPlaidAccessToken: jest.fn().mockReturnValue("plaidToken"),
          getBtcAddress: jest.fn().mockReturnValue("publicAddress"),
        },
      });

      mockExchangeRateService.getBtcInUsd.mockResolvedValue(100000);

      mockPlaidService.getAccounts.mockResolvedValue([
        {
          id: "fiatAccountId",
          balance: 200,
        },
      ]);

      mockBitcoinService.sendCoins.mockResolvedValue();

      await controller.buyBtc(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ success: true });
      expect(mockBitcoinService.sendCoins).toHaveBeenCalledWith(
        "publicAddress",
        "0.00100000"
      );
    });

    it("should return 400 if fiat account does not exist", async () => {
      const req = {
        userId: "userId",
        body: {
          fiatAmount: 100,
          fiatAccountId: "invalidAccountId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      mockUserRepository.getById.mockResolvedValue({
        ok: true,
        val: {
          getPlaidAccessToken: jest.fn().mockReturnValue("plaidToken"),
          getBtcAddress: jest.fn().mockReturnValue("publicAddress"),
        },
      });

      mockUserEntity.create.mockReturnValue({
        val: {
          getPlaidAccessToken: jest.fn().mockReturnValue("plaidToken"),
          getBtcAddress: jest.fn().mockReturnValue("publicAddress"),
        },
      });

      mockPlaidService.getAccounts.mockResolvedValue([
        {
          id: "fiatAccountId",
          balance: 200,
        },
      ]);

      await controller.buyBtc(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        error: "Fiat account does not exit",
      });
    });

    it("should return 400 if exchange rate is not available", async () => {
      const req = {
        userId: "userId",
        body: {
          fiatAmount: 100,
          fiatAccountId: "fiatAccountId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      mockUserRepository.getById.mockResolvedValue({
        ok: true,
        val: {
          getPlaidAccessToken: jest.fn().mockReturnValue("plaidToken"),
          getBtcAddress: jest.fn().mockReturnValue("publicAddress"),
        },
      });

      mockUserEntity.create.mockReturnValue({
        val: {
          getPlaidAccessToken: jest.fn().mockReturnValue("plaidToken"),
          getBtcAddress: jest.fn().mockReturnValue("publicAddress"),
        },
      });

      mockExchangeRateService.getBtcInUsd.mockResolvedValue(null);

      await controller.buyBtc(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        error: "Exhange rate not available",
      });
    });

    it("should return 400 if not enough balance", async () => {
      const req = {
        userId: "userId",
        body: {
          fiatAmount: 300,
          fiatAccountId: "fiatAccountId",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      mockUserRepository.getById.mockResolvedValue({
        ok: true,
        val: {
          getPlaidAccessToken: jest.fn().mockReturnValue("plaidToken"),
          getBtcAddress: jest.fn().mockReturnValue("publicAddress"),
        },
      });

      mockUserEntity.create.mockReturnValue({
        val: {
          getPlaidAccessToken: jest.fn().mockReturnValue("plaidToken"),
          getBtcAddress: jest.fn().mockReturnValue("publicAddress"),
        },
      });

      mockExchangeRateService.getBtcInUsd.mockResolvedValue(100000);

      mockPlaidService.getAccounts.mockResolvedValue([
        {
          id: "fiatAccountId",
          balance: 200,
        },
      ]);

      await controller.buyBtc(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ error: "Not enough balance" });
    });
  });
});
