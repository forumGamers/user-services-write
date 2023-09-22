import BaseValidation from "../base/validation";
import * as yup from "yup";
import { RegisterInput } from "../interfaces/auth";

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
}

export default new AuthValidation();
