"use strict";

import { Options, Sequelize } from "sequelize";
import User from "./user";
import Admin from "./admin";
import Seller from "./seller";
import Token from "./token";
const config = require("../../config/config.json");
require("dotenv/config");
const production: string = process.env[config.use_env_variable] as string;
let sequelize: Sequelize;

if (process.env.NODE_ENV === "test") {
  sequelize = new Sequelize(
    config.test.database,
    config.test.username,
    config.test.password,
    <Options>config.test
  );
} else if (
  process.env.NODE_ENV === "production" ||
  process.env[config.use_env_variable]
) {
  sequelize = new Sequelize(production, <Options>config.production);
} else {
  sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    <Options>config.development
  );
}

const model = [User, Admin, Seller, Token];

model.forEach((el) => el.initialize(sequelize));

model.forEach((el) => el.associate({ User, Admin, Seller, Token }));

export { sequelize as Db, User, Admin, Seller, Token };
