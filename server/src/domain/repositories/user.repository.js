import { createOk, createErr } from "option-t/PlainResult";
import { SequelizeUser } from "../../infrastructure/database/models/user.model.js";

const DATABASE_ERROR = "Database error";

export class UserRepository {
  static async create(userEntity) {
    try {
      const created = await SequelizeUser.create({
        email: userEntity.getEmail(),
        password: userEntity.getPassword(),
        name: userEntity.getName(),
      });
      return createOk({
        id: created.id,
      });
    } catch {
      createErr(DATABASE_ERROR);
    }
  }
  static async getById(id) {
    try {
      const user = await SequelizeUser.findOne({ id });
      return createOk(user);
    } catch {
      createErr(DATABASE_ERROR);
    }
  }
}
