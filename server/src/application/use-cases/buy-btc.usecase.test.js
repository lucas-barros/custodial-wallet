import { jest } from "@jest/globals";
import { BuyBtcUseCase } from "./buy-btc.usecase.js";

const mockUserRepository = {
  create: jest.fn(),
  getByEmail: jest.fn(),
  getById: jest.fn(),
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

describe("BuyBtcUseCase", () => {
  it("should buy BTC for the user", async () => {
    mockUserRepository.getById.mockResolvedValue({
      ok: true,
      val: {
        email: "user@mail.com",
        password: "hash",
        name: "Lucas",
        btcAddress: "publicAddress",
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

    const buyBtcUseCase = new BuyBtcUseCase({
      userRepository: mockUserRepository,
      exchangeRateService: mockExchangeRateService,
      plaidService: mockPlaidService,
      bitcoinService: mockBitcoinService,
    });

    const result = await buyBtcUseCase.execute({
      userId: "userId",
      fiatAmount: 100,
      fiatAccountId: "fiatAccountId",
    });

    expect(result.ok).toBe(true);
    expect(mockBitcoinService.sendCoins).toHaveBeenCalledWith(
      "publicAddress",
      "0.00100000"
    );
  });

  it("should return error if fiat account does not exist", async () => {
    mockUserRepository.getById.mockResolvedValue({
      ok: true,
      val: {
        email: "user@mail.com",
        password: "hash",
        name: "Lucas",
        btcAddress: "btcAddress",
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

    const buyBtcUseCase = new BuyBtcUseCase({
      userRepository: mockUserRepository,
      exchangeRateService: mockExchangeRateService,
      plaidService: mockPlaidService,
      bitcoinService: mockBitcoinService,
    });

    const result = await buyBtcUseCase.execute({
      userId: "userId",
      fiatAmount: 100,
      fiatAccountId: "invalidAccountId",
    });

    expect(result.err).toBe("Fiat account does not exit");
  });

  it("should return error if exchange rate is not available", async () => {
    mockUserRepository.getById.mockResolvedValue({
      ok: true,
      val: {
        email: "user@mail.com",
        password: "hash",
        name: "Lucas",
        btcAddress: "btcAddress",
      },
    });
    mockExchangeRateService.getBtcInUsd.mockResolvedValue(null);
    mockPlaidService.getAccounts.mockResolvedValue([
      {
        id: "fiatAccountId",
        balance: 200,
      },
    ]);
    mockBitcoinService.sendCoins.mockResolvedValue();

    const buyBtcUseCase = new BuyBtcUseCase({
      userRepository: mockUserRepository,
      exchangeRateService: mockExchangeRateService,
      plaidService: mockPlaidService,
      bitcoinService: mockBitcoinService,
    });

    const result = await buyBtcUseCase.execute({
      userId: "userId",
      fiatAmount: 300,
      fiatAccountId: "fiatAccountId",
    });

    expect(result.err).toBe("Exhange rate not available");
  });

  it("should return error if not enough balance", async () => {
    mockUserRepository.getById.mockResolvedValue({
      ok: true,
      val: {
        email: "user@mail.com",
        password: "hash",
        name: "Lucas",
        btcAddress: "btcAddress",
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

    const buyBtcUseCase = new BuyBtcUseCase({
      userRepository: mockUserRepository,
      exchangeRateService: mockExchangeRateService,
      plaidService: mockPlaidService,
      bitcoinService: mockBitcoinService,
    });

    const result = await buyBtcUseCase.execute({
      userId: "userId",
      fiatAmount: 400,
      fiatAccountId: "fiatAccountId",
    });

    expect(result.err).toBe("Not enough balance");
  });
});
