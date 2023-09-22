import { NextFunction, Request, Response } from "express";
import validator from "../validations/auth";
import { User } from "../models";
import response from "../middlewares/response";

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

      await User.create({ fullname, username, email, password });

      response({ code: 201, res, message: "Success Register" });
    } catch (err) {
      next(err);
    }
  }
}
