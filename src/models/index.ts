"use strict";

import { Options, Sequelize } from "sequelize";
import User from "./user";
import Admin from "./admin";
import Seller from "./seller";
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

[User, Admin, Seller].forEach((el) => el.initialize(sequelize));

User.associate({ Admin, Seller });

Admin.associate({ User });

Seller.associate({ User });

export { sequelize as Db, User, Admin, Seller };
