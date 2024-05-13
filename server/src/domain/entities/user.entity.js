import { createOk, createErr } from "option-t/PlainResult";

const INVALID_EMAIL = "Email is invalid";
const MISSING_DATA = "Missing data";

export class UserEntity {
  static EMAIL_REGEX = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;

  id;
  email;
  password;
  name;
  plaidAccessToken;
  btcAddress;

  constructor({ id, email, password, name, btcAddress, plaidAccessToken }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.btcAddress = btcAddress;
    this.plaidAccessToken = plaidAccessToken;
  }

  static create({ id, email, password, name, btcAddress, plaidAccessToken }) {
    const isValidEmail = UserEntity.validateEmail(email);
    if (!email || !password || !name || !btcAddress) {
      return createErr(MISSING_DATA);
    }
    if (!isValidEmail) {
      return createErr(INVALID_EMAIL);
    }

    const user = new UserEntity({
      id,
      email,
      password,
      name,
      btcAddress,
      plaidAccessToken,
    });

    return createOk(user);
  }

  static validateEmail(email) {
    return UserEntity.EMAIL_REGEX.test(email);
  }

  getUserId() {
    return this.id;
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
