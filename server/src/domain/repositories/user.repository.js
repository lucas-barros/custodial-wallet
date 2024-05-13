import { createOk, createErr } from "option-t/PlainResult";

const DATABASE_ERROR = "Database error";
export class UserRepository {
  userModel;
  constructor(userModel) {
    this.userModel = userModel;
  }
  async create(userEntity) {
    try {
      const created = await this.userModel.create({
        email: userEntity.getEmail(),
        password: userEntity.getPassword(),
        name: userEntity.getName(),
        btcAddress: userEntity.getBtcAddress(),
      });
      return createOk({
        id: created.id,
      });
    } catch (error) {
      return createErr(DATABASE_ERROR);
    }
  }

  async getById(id) {
    try {
      const user = await this.userModel.findOne({ where: { id } });
      return createOk(user.toJSON());
    } catch {
      return createErr(DATABASE_ERROR);
    }
  }

  async getByEmail(email) {
    try {
      const user = await this.userModel.findOne({ where: { email } });
      return createOk(user.toJSON());
    } catch {
      return createErr(DATABASE_ERROR);
    }
  }

  async setPlaidToken(id, accessToken) {
    try {
      const user = await this.userModel.findOne({ where: { id } });
      user.plaidAccessToken = accessToken;
      await user.save();
      return createOk();
    } catch (error) {
      return createErr(DATABASE_ERROR);
    }
  }
}
