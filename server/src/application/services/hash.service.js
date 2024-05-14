import bcrypt from "bcrypt";

export class HashService {
  static saltRounds = 10;

  hash(password) {
    return bcrypt.hash(password, HashService.saltRounds);
  }

  compare(password, hash) {
    return bcrypt.compare(password, hash);
  }
}
