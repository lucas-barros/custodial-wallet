import { UserEntity } from "../../domain/entities/user.entity.js";
import { createErr, createOk } from "option-t/PlainResult";

export class GetBtcAccountUseCase {
  constructor({ userRepository, bitcoinService }) {
    this.userRepository = userRepository;
    this.bitcoinService = bitcoinService;
  }

  async execute(id) {
    const { val: userModel, err: userModelErr } =
      await this.userRepository.getById(id);

    if (userModelErr) {
      return createErr(userModelErr);
    }
    const { val: user, err: userErr } = UserEntity.create(userModel);

    if (userErr) {
      return createErr(userErr);
    }

    const btcAddress = user.getBtcAddress();
    const balance = await this.bitcoinService.getExtBalance(btcAddress);

    return createOk({
      btcAddress,
      balance,
    });
  }
}
