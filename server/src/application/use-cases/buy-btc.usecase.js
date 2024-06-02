import { UserEntity } from "../../domain/entities/user.entity.js";
import { createErr, createOk } from "option-t/PlainResult";

export class BuyBtcUseCase {
  constructor({
    userRepository,
    exchangeRateService,
    plaidService,
    bitcoinService,
  }) {
    this.userRepository = userRepository;
    this.exchangeRateService = exchangeRateService;
    this.plaidService = plaidService;
    this.bitcoinService = bitcoinService;
  }

  async execute({ userId, fiatAmount, fiatAccountId }) {
    const { val: userModel, err: userModelErr } =
      await this.userRepository.getById(userId);

    if (userModelErr) {
      return createErr(userModelErr);
    }
    const { val: user, err: userErr } = UserEntity.create(userModel);

    if (userErr) {
      return createErr(userErr);
    }

    const btcAddress = user.getBtcAddress();
    const btcInUsd = await this.exchangeRateService.getBtcInUsd();
    const fiatAccounts = await this.plaidService.getAccounts(
      user.getPlaidAccessToken()
    );
    const fiatAccount = fiatAccounts.find(
      (fiatAccount) => fiatAccount.id === fiatAccountId
    );

    if (!fiatAccount) {
      return createErr("Fiat account does not exit");
    }

    if (!btcInUsd) {
      return createErr("Exhange rate not available");
    }

    if (
      Number(fiatAccount.balance) < Number(fiatAmount) ||
      Number(fiatAmount) === 0
    ) {
      return createErr("Not enough balance");
    }

    const btcAmount = Number(fiatAmount) / Number(btcInUsd);
    await this.bitcoinService.sendCoins(btcAddress, btcAmount.toFixed(8));
    
    return createOk();
  }
}
