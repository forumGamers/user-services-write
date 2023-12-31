import type { NextFunction, Request, Response } from "express";
import validator from "../validations/auth";
import { Db, User, Token } from "../models";
import response from "../middlewares/response";
import broker from "../broker";
import AppError from "../base/error";
import encryption from "../helpers/encryption";
import jwt from "../helpers/jwt";
import { QueryTypes } from "sequelize";
import { UserAttributes } from "../interfaces/user";
import { AdminAttributes } from "../interfaces/admin";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { v4 } from "uuid";
import Helper from "../helpers";
import type { AuthController } from "../interfaces/auth";

export default new (class Controller implements AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        fullname,
        username,
        email,
        password,
      } = await validator.registerValidation(req.body);

      const user = await User.create({
        fullname,
        username,
        email,
        password,
        UUID: v4(),
      });

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
        followers: [],
        following: [],
      });

      (user as any).password = undefined;

      response({ code: 201, res, message: "Success Register", data: user });
    } catch (err) {
      next(err);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, as } = await validator.loginValidate(req.body);

      const joinTable = Helper.userStatus(as);

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

  public async googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { google_token } = req.headers;

      const client = new OAuth2Client(
        process.env.GOOGLE_OAUTH_CLIENTID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET
      );

      const ticket = await client.verifyIdToken({
        idToken: google_token as string,
        audience: process.env.GOOGLE_OAUTH_CLIENTID,
      });

      const {
        given_name,
        family_name,
        email,
      } = ticket.getPayload() as TokenPayload;

      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          email,
          password: "GOOGLE LOGIN",
          username: family_name ? `${given_name} ${family_name}` : given_name,
          fullname: family_name ? `${given_name} ${family_name}` : given_name,
          isVerified: true,
          UUID: v4(),
        },
        hooks: false,
      });

      const access_token = jwt.createToken({
        UUID: user.UUID,
        loggedAs: "User",
      });

      const token = await Token.create({
        access_token,
        role: "User",
        userId: user.UUID,
      });

      if (created)
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
          followers: [],
          following: [],
        });

      await broker.sendNewToken({
        access_token,
        user_id: token.userId,
        as: "User",
        created_at: token.createdAt,
        updated_at: token.updatedAt,
      });

      response({ res, code: 200, data: access_token });
    } catch (err) {
      next(err);
    }
  }

  public async generateForgetPasswordToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = await validator.emailValidation(req.body);

      const [user]: UserAttributes[] = await Db.query(
        `SELECT * FROM "Users" u WHERE u.email = $1;`,
        {
          type: QueryTypes.SELECT,
          bind: [email],
        }
      );

      if (!user)
        throw new AppError({ message: "data not found", statusCode: 404 });

      const access_token = jwt.createToken({
        UUID: user.UUID,
        loggedAs: "User",
      });

      const token = await Token.create({
        access_token,
        userId: user.UUID,
        as: "User",
      });

      await broker.sendNewToken({
        access_token,
        user_id: token.userId,
        as: "User",
        created_at: token.createdAt,
        updated_at: token.updatedAt,
      });

      response({ res, code: 200, message: "success", data: access_token });
    } catch (err) {
      next(err);
    }
  }

  public async changeForgetPass(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const transaction = await Db.transaction();
    try {
      const { UUID } = req.user as UserAttributes;
      const { access_token } = req.headers;

      const { password } = await validator.resetPasswordValidation(req.body);

      const [_, [user]] = await User.update(
        { password },
        { where: { UUID }, returning: true, transaction }
      );
      await Token.destroy({ where: { access_token }, transaction });

      await broker.sendUpdateUser({
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
        followers: [],
        following: [],
      });

      await transaction.commit();
      response({ res, code: 200, message: "success" });
    } catch (err) {
      await transaction.rollback();
      next(err);
    }
  }

  public async verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { token = "" } = req.query;

      const { UUID } = jwt.verifyToken(token as string);

      const user = await User.findOne({ where: { UUID } });
      if (!user)
        throw new AppError({ statusCode: 404, message: "data not found" });

      await User.update({ isVerified: true }, { where: { UUID } });

      await broker.sendUpdateUser({
        id: user.UUID,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        password: user.password,
        is_verified: true,
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
        followers: [],
        following: [],
      });

      response({ res, code: 200, message: "success" });
    } catch (err) {
      next(err);
    }
  }
})();
