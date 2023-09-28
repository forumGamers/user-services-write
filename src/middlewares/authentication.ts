import { NextFunction, Request, Response } from "express";
import AppError from "../base/error";
import { Db } from "../models";
import jwt from "../helpers/jwt";
import { QueryTypes } from "sequelize";
import { TokenAttributes } from "../interfaces/token";
import { UserAttributes } from "../interfaces/user";
import { AdminAttributes } from "../interfaces/admin";
import { SellerAttributes } from "../interfaces/seller";

class Auth {
  private getTokens(req: Request) {
    const { access_token } = req.headers as Record<string, string>;
    if (!access_token)
      throw new AppError({ message: "invalid token", statusCode: 401 });
    return access_token;
  }

  private generateQuery(type: "User" | "Admin" | "Seller") {
    let query = `SELECT * FROM "Tokens" t`;

    switch (type) {
      case "Admin":
        query += ` JOIN "Admins" a on t."userId" = a."userId"`;
        break;
      case "Seller":
        query += ` JOIN "Sellers" s on t."userId" = s."userId"`;
        break;
      case "User":
        query += ` JOIN "Users" u on t."userId" = u."UUID"`;
        break;
      default:
        throw new AppError({ message: "invalid token", statusCode: 401 });
    }
    return (query += ` WHERE t."access_token" = $1;`);
  }

  private async getUserData(query: string, access_token: string) {
    const [user] = await Db.query<
      TokenAttributes & (UserAttributes | AdminAttributes | SellerAttributes)
    >(query, {
      type: QueryTypes.SELECT,
      bind: [access_token],
    });

    if (!user)
      throw new AppError({ message: "invalid token", statusCode: 401 });

    return user;
  }

  private bindRequest(
    req: Request,
    loggedAs: "User" | "Admin" | "Seller",
    user: TokenAttributes &
      (UserAttributes | AdminAttributes | SellerAttributes),
  ) {
    req.user = {
      loggedAs,
      ...user,
    };
  }

  public async authentication(req: Request, res: Response, next: NextFunction) {
    try {
      const access_token = this.getTokens(req);

      const payload = jwt.verifyToken(access_token);
      const user = await this.getUserData(
        this.generateQuery(payload.loggedAs),
        access_token,
      );
      this.bindRequest(req, payload.loggedAs, user);

      next();
    } catch (err) {
      next(err);
    }
  }
}

export default new Auth().authentication.bind(new Auth());
