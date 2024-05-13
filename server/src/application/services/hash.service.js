export class HashService {
  static saltRounds = 10;
  bcrypt;
  constructor(bcrypt) {
    this.bcrypt = bcrypt;
  }

  hash(password) {
    return this.bcrypt.hash(password, HashService.saltRounds);
  }

  compare(password, hash) {
    return this.bcrypt.compare(password, hash);
  }
}
