import type { NextFunction, Request, Response } from "express";
import type { MulterFile } from ".";

export interface UserAttributes {
  fullname: string;
  username: string;
  UUID: string;
  email: string;
  password: string;
  isVerified: boolean;
  bio: string;
  imageUrl: string;
  imageId: string;
  backgroundUrl: string;
  backgroundId: string;
  status: "active" | "nonActive";
  createdAt: Date;
  updatedAt: Date;
}

export interface UserBroker {
  id: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  is_verified: boolean;
  bio: string;
  image_url: string;
  image_id: string;
  background_url: string;
  background_id: string;
  status: "active" | "nonActive";
  created_at: Date;
  updated_at: Date;
  store_id?: string;
  division?:
    | "Director"
    | "Finance"
    | "IT"
    | "Third Party"
    | "Customer Service"
    | "Marketing"
    | null;
  role?: "Supervisor" | "Manager" | "Staff" | null;
  following: string[];
  followers: string[];
}

export interface UserController {
  updateProfileImg(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}

export interface IUserValidation {
  changeProfileImgInput(data: any): Promise<MulterFile>;
}
