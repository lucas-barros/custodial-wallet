import { createOk, createErr } from "option-t/PlainResult";

const INVALID_EMAIL = "Email is invalid";

export class UserEntity {
  static EMAIL_REGEX = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;

  email;
  password;
  name;
  plaidAccessToken;
  btcAddress;

  constructor({ email, password, name }) {
    this.email = email;
    this.password = password;
    this.name = name;
  }

  static create({ email, password, name }) {
    const user = new UserEntity({ email, password, name });
    if (!user.validateEmail()) {
      return createErr(INVALID_EMAIL);
    }

    return createOk(user);
  }

  validateEmail() {
    return UserEntity.EMAIL_REGEX.test(this.email);
  }

  getEmail() {
    return this.email;
  }

  getPassword() {
    return this.password;
  }

  getName() {
    return this.name;
  }

  getPlaidAccessToken() {
    return this.plaidAccessToken;
  }

  getBtcAddress() {
    return this.btcAddress;
  }
}
