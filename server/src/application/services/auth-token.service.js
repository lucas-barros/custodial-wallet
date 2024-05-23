import { default as jwt } from "jsonwebtoken";
import { createErr, createOk } from "option-t/PlainResult";

export class AuthTokenService {
  secret;
  constructor(secret) {
    this.secret = secret;
  }
  verify(token) {
    try {
      const decode = jwt.verify(token, this.secret);
      return createOk(decode);
    } catch (error) {
      console.log(error);
      return createErr("Invalid token");
    }
  }

  sign(payload) {
    try {
      const token = jwt.sign(payload, this.secret, {
        expiresIn: 86400000,
      });

      return createOk(token);
    } catch (error) {
      console.log(error);
      return createErr("Failed to sign");
    }
  }
}
