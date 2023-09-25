import { NextFunction, Request, Response } from "express";
import validator from "../validations/auth";
import { User } from "../models";
import response from "../middlewares/response";
import broker from "../broker";

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
        background_url: user.backgroundUrl,
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
}
