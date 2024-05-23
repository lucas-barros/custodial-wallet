import { AuthTokenService } from "./auth-token.service";
import { default as jwt } from "jsonwebtoken";

const USER_ID_PAYLOAD = { userId: "id" };
const SECRET = "mysecret";
const SIGNED_MESSAGE = jwt.sign(USER_ID_PAYLOAD, SECRET, {
  expiresIn: 86400000,
});

describe("AuthTokenService", () => {
  describe("sign method", () => {
    it("should sign data successfuly", () => {
      const authTokenService = new AuthTokenService(SECRET);
      const signedResult = authTokenService.sign(USER_ID_PAYLOAD);

      expect(signedResult.val).toBe(SIGNED_MESSAGE);
    });

    it("should failed to sign data", () => {
      const authTokenService = new AuthTokenService(SECRET);
      const signedResult = authTokenService.sign();
      console.log(signedResult);
      expect(signedResult.err).toBe("Failed to sign");
    });
  });

  describe("verify method", () => {
    it("should verify a token successfuly", () => {
      const authTokenService = new AuthTokenService(SECRET);

      const verifyResult = authTokenService.verify(SIGNED_MESSAGE);
      expect(verifyResult.val.userId).toBe(USER_ID_PAYLOAD.userId);
    });

    it("should fail to verify a token", () => {
      const authTokenService = new AuthTokenService(SECRET);

      const verifyResult = authTokenService.verify("somevalue");
      expect(verifyResult.err).toBe("Invalid token");
    });
  });
});
