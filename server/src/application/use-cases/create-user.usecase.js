import { UserEntity } from "../../domain/entities/user.entity.js";
import { createErr, createOk } from "option-t/PlainResult";

export class CreateUserUseCase {
  constructor({ keysService, hashService, authTokenService, userRepository }) {
    this.keysService = keysService;
    this.hashService = hashService;
    this.authTokenService = authTokenService;
    this.userRepository = userRepository;
  }

  async execute({ email, password, name }) {
    const { publicAddress, encryptedPrivateKey } =
      await this.keysService.createKeys();
    const hashedPassword = await this.hashService.hash(password);
    const { val: user, err: userErr } = await UserEntity.create({
      email,
      password: hashedPassword,
      name,
      btcAddress: publicAddress,
      encryptedPrivateKey,
    });

    if (userErr) {
      return createErr(userErr);
    }

    const { val: createUserResult, err: createUserErr } =
      await this.userRepository.create(user);

    if (createUserErr) {
      return createErr(createUserErr);
    }

    const { val: token } = this.authTokenService.sign({
      userId: createUserResult.id,
    });

    return createOk(token);
  }
}
