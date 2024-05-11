import { UserEntity } from "./entities/user.entity.js";
import { UserRepository } from "./repositories/user.repository.js";

export const container = {
  UserRepository,
  UserEntity,
};
