import { UserEntity } from "../../domain/entities/user.entity.js";
import { createErr, createOk } from "option-t/PlainResult";

export class GetUserUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
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

    return createOk({
      id,
      name: user.getName(),
      email: user.getEmail(),
      btcAddress: user.getBtcAddress(),
      isPlaidConnected: Boolean(user.getPlaidAccessToken()),
    });
  }
}
