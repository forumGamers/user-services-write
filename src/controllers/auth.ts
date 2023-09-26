import { NextFunction, Request, Response } from "express";
import validator from "../validations/auth";
import { Db, User, Token } from "../models";
import response from "../middlewares/response";
import broker from "../broker";
import AppError from "../base/error";
import encryption from "../helpers/encryption";
import jwt from "../helpers/jwt";
import { QueryTypes } from "sequelize";
import { UserAttributes } from "../models/user";
import { AdminAttributes } from "../models/admin";

export default class Controller {
  public static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        fullname,
        username,
        email,
        password,
      } = await validator.registerValidation(req.body);

      const user = await User.create({ fullname, username, email, password });
      await broker.sendNewUser({
        id: user.UUID,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        password: user.password,
        is_verified: user.isVerified,
        bio: user.bio,
        image_url: user.imageUrl,
        image_id: user.imageId,
        background_url: user.backgroundUrl,
        background_id: user.backgroundId,
        status: user.status,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        store_id: "",
        division: null,
        role: null,
      });

      response({ code: 201, res, message: "Success Register" });
    } catch (err) {
      next(err);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, as } = await validator.loginValidate(req.body);

      let joinTable;
      switch (as) {
        case "Admin":
          joinTable = "Admins";
          break;
        case "Seller":
          joinTable = "Sellers";
          break;
        default:
          joinTable = "Users";
          break;
      }

      let query = `SELECT * FROM "Users" u`;
      if (!!joinTable && joinTable !== "Users")
        query += ` JOIN "${joinTable}" a ON u."UUID" = a."userId"`;

      query += ` WHERE u.email = $1;`;

      const [user]: (UserAttributes & AdminAttributes)[] = await Db.query(
        query,
        {
          type: QueryTypes.SELECT,
          bind: [email],
        }
      );
      if (!user || !encryption.compareEncryption(password, user.password))
        throw new AppError({ message: "invalid credentials", statusCode: 401 });

      const access_token = jwt.createToken({ UUID: user.UUID, loggedAs: as });
      const token = await Token.create({
        access_token,
        userId: user.UUID,
        as,
      });

      await broker.sendNewToken({
        access_token,
        user_id: token.userId,
        as,
        created_at: token.createdAt,
        updated_at: token.updatedAt,
      });

      response({ res, code: 200, message: "success", data: { access_token } });
    } catch (err) {
      next(err);
    }
  }
}
