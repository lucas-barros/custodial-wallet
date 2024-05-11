import { Sequelize } from "sequelize";
import { configByEnv } from "./config.cjs";

const { development: config } = configByEnv;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
  }
);

sequelize.sync();

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection setup successfully!");
  } catch (error) {
    console.log("Unable to connect to the database", error);
  }
})();

export default sequelize;
