import type { NextFunction, Request, Response } from "express";
export interface RegisterInput {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
  as: "User" | "Admin" | "Seller";
}

export interface ResetPasswordInput {
  password: string;
  confirmPassword: string;
}

export interface AuthController {
  register(req: Request, res: Response, next: NextFunction): Promise<void>;
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  googleLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
  generateForgetPasswordToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  changeForgetPass(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  verifyUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IAuthValidation {
  registerValidation(data: any): Promise<RegisterInput>;
  resetPasswordValidation(data: any): Promise<ResetPasswordInput>;
  loginValidate(data: any): Promise<LoginInput>;
  emailValidation(data: any): Promise<{ email: string }>;
}
