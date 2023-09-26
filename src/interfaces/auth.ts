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
