import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize";

export class SequelizeUser extends Model {
  id;
  email;
  password;
  plaidAccessToken;
  btcAddress;
}

SequelizeUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plaidAccessToken: {
      type: DataTypes.STRING,
    },
    btcAddress: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);
