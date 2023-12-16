import type { UserAttributes } from "../interfaces/user";
import type { AdminAttributes } from "../models/admin";
import type { SellerAttributes } from "../models/seller";

export {};

declare global {
  namespace Express {
    interface Request {
      user: (UserAttributes | AdminAttributes | SellerAttributes) & {
        loggedAs: "User" | "Admin" | "Seller";
      };
    }
  }
}
