import { UserAttributes } from "../interfaces/user";
import { AdminAttributes } from "../models/admin";
import { SellerAttributes } from "../models/seller";

declare global {
  namespace Express {
    interface Request {
      user: (UserAttributes | AdminAttributes | SellerAttributes) & {
        loggedAs: "User" | "Admin" | "Seller";
      };
    }
  }
}
