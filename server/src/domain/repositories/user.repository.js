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
      const user = await this.userModel.findOne({ id });
      return createOk(user);
    } catch {
      return createErr(DATABASE_ERROR);
    }
  }
}
