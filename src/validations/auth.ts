import BaseValidation from "../base/validation";
import * as yup from "yup";
import { LoginInput, RegisterInput } from "../interfaces/auth";

class AuthValidation extends BaseValidation {
  constructor() {
    super();
  }
  public async registerValidation(data: any) {
    return await this.validate<RegisterInput>(
      yup
        .object()
        .shape({
          fullname: yup.string().required("fullname is required"),
          username: yup.string().required("username is required"),
          email: yup
            .string()
            .required("email is required")
            .email("invalid email format"),
          password: yup
            .string()
            .required("password is required")
            .test((val) => this.passwordValidation(val)),
          confirmPassword: yup
            .string()
            .required("confirm password is required"),
        })
        .test(
          "is same",
          "password is not match with confirm password",
          (val) => val.password === val.confirmPassword
        ),
      data
    );
  }

  public async loginValidate(data: any) {
    return await this.validate<LoginInput>(
      yup.object().shape({
        email: yup
          .string()
          .required("email is required")
          .email("invalid email format"),
        password: yup.string().required("password is required"),
        as: yup
          .string()
          .default("User")
          .oneOf(["User", "Admin", "Seller"], "Invalid account type"),
      }),
      data
    );
  }

  public async emailValidation(data: any) {
    return await this.validate<{ email: string }>(
      yup.object().shape({
        email: yup
          .string()
          .required("Please fill your email")
          .email("Invalid email format"),
      }),
      data
    );
  }
}

export default new AuthValidation();
