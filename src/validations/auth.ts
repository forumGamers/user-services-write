import BaseValidation from "../base/validation";
import * as yup from "yup";
import {
  IAuthValidation,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "../interfaces/auth";

export default new (class AuthValidation extends BaseValidation
  implements IAuthValidation {
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

  public async resetPasswordValidation(data: any) {
    return await this.validate<ResetPasswordInput>(
      yup
        .object()
        .shape({
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
})();
