"use strict";

import { Options, Sequelize } from "sequelize";
import User from "./user";
import Admin from "./admin";
import Seller from "./seller";
import Balance from "./balance";
const config = require("../../config/config.json");
require("dotenv/config");

class Database {
  private Db!: Sequelize;
  private User: typeof User;
  private Admin: typeof Admin;
  private Seller: typeof Seller;
  private Balance: typeof Balance;

  constructor() {
    this.User = User;
    this.Admin = Admin;
    this.Seller = Seller;
    this.Balance = Balance;

    const production: string = process.env[config.use_env_variable] as string;
    if (process.env.NODE_ENV === "test") {
      this.Db = new Sequelize(
        config.test.database,
        config.test.username,
        config.test.password,
        <Options>config.test
      );
    } else if (
      process.env.NODE_ENV === "production" ||
      process.env[config.use_env_variable]
    ) {
      this.Db = new Sequelize(production, <Options>config.production);
    } else {
      this.Db = new Sequelize(
        config.development.database,
        config.development.username,
        config.development.password,
        <Options>config.development
      );
    }

    [this.User, this.Admin, this.Seller, this.Balance].forEach((el) => {
      el.initialize(this.Db);

      switch (true) {
        case el instanceof User:
          el.associate({ Admin, Seller });
          break;
        case el instanceof Admin:
        case el instanceof Seller:
        case el instanceof Balance:
          el.associate({ User });
          break;
        default:
          break;
      }
    });
  }

  public getDb() {
    return {
      Db: this.Db,
      User: this.User,
      Admin: this.Admin,
      Seller: this.Seller,
      Balance: this.Balance,
    };
  }
}

export default new Database().getDb();
