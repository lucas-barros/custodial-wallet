import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize.js";

export class SequelizeUser extends Model {}

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
    name: {
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
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);
