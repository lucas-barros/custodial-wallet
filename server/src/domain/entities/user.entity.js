import { createOk, createErr } from "option-t/PlainResult";

const INVALID_EMAIL = "Email is invalid";
const MISSING_DATA = "Missing data";

export class UserEntity {
  static EMAIL_REGEX = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;

  email;
  password;
  name;
  plaidAccessToken;
  btcAddress;

  constructor({ email, password, name, btcAddress }) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.btcAddress = btcAddress;
  }

  static async create({ email, password, name, btcAddress }) {
    const isValidEmail = UserEntity.validateEmail(email);
    if (!email || !password || !name || !btcAddress) {
      return createErr(MISSING_DATA);
    }
    if (!isValidEmail) {
      return createErr(INVALID_EMAIL);
    }

    const user = new UserEntity({
      email,
      password,
      name,
      btcAddress,
    });

    return createOk(user);
  }

  static validateEmail(email) {
    return UserEntity.EMAIL_REGEX.test(email);
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
