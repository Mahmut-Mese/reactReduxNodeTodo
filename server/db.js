import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const {
  MYSQL_URI,
  MYSQL_HOST = "localhost",
  MYSQL_PORT = "3306",
  MYSQL_DB = "todoapp",
  MYSQL_USER = "root",
  MYSQL_PASSWORD = "",
} = process.env;

let sequelize;
if (MYSQL_URI) {
  sequelize = new Sequelize(MYSQL_URI, {
    dialect: "mysql",
    logging: false,
  });
} else {
  sequelize = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PASSWORD, {
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT),
    dialect: "mysql",
    logging: false,
  });
}

export default sequelize;

