import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { IDatabaseConfig } from "./types";

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

dotenv.config();

const {
  MYSQL_URI,
  MYSQL_HOST = "localhost",
  MYSQL_PORT = "3306",
  MYSQL_DB = "todoapp",
  MYSQL_USER = "root",
  MYSQL_PASSWORD = "",
} = process.env;

let sequelize: any;

if (MYSQL_URI) {
  sequelize = new Sequelize(MYSQL_URI, {
    dialect: "mysql",
    logging: false,
  });
} else {
  const config: DatabaseConfig = {
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT),
    database: MYSQL_DB,
    username: MYSQL_USER,
    password: MYSQL_PASSWORD,
  };

  sequelize = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PASSWORD, {
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT),
    dialect: "mysql",
    logging: false,
  });
}

export default sequelize;
