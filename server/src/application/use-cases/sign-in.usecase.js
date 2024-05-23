import { UserEntity } from "../../domain/entities/user.entity.js";
import { createErr, createOk } from "option-t/PlainResult";

export class SignInUseCase {
  constructor({ hashService, userRepository, authTokenService }) {
    this.hashService = hashService;
    this.userRepository = userRepository;
    this.authTokenService = authTokenService;
  }

  async execute({ email, password }) {
    const { val: userModel, err: userModelErr } =
      await this.userRepository.getByEmail(email);

    if (userModelErr) {
      return createErr(userModelErr);
    }
    const { val: user, err: userErr } = UserEntity.create(userModel);
    const isValid = await this.hashService.compare(
      password,
      user.getPassword()
    );

    if (!isValid) {
      return createErr(userErr);
    }

    const userId = user.getUserId();
    const { val: token } = this.authTokenService.sign({ userId });

    return createOk(token);
  }
}
