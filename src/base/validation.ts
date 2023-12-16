import * as yup from "yup";
import AppError from "./error";

export default abstract class BaseValidation {
  protected async validate<T>(schema: yup.Schema, data: any): Promise<T> {
    try {
      return (await schema.validate(data, {
        stripUnknown: true,
        abortEarly: false,
      })) as T;
    } catch (err) {
      const { errors } = err as { errors: string[] };

      throw new AppError({ message: errors.join(",\n "), statusCode: 400 });
    }
  }

  protected passwordValidation(password: string) {
    const requirements = [
      {
        regex: /(?=.*[a-z])/,
        message: "Mohon masukkan kata sandi dengan minimal 1 huruf kecil",
      },
      {
        regex: /(?=.*[A-Z])/,
        message: "Mohon masukkan kata sandi dengan minimal 1 huruf besar",
      },
      {
        regex: /(?=.*\d)/,
        message: "Mohon masukkan kata sandi dengan minimal 1 angka",
      },
      {
        regex: /(?=.*[!@#$%^&*])/,
        message: "Mohon masukkan kata sandi dengan minimal 1 simbol",
      },
      { regex: /^.{8,}$/, message: "Password minimum 8 karakter" },
    ];
    const errors = [];

    for (const requirement of requirements)
      if (!requirement.regex.test(password))
        errors.push(new Error(requirement.message).message);

    if (errors.length) throw { errors };

    return true;
  }

  protected imageValidator = {
    fieldname: yup.string(),
    originalname: yup.string(),
    filename:yup.string(),
    encoding: yup.string(),
    buffer: yup.mixed(),
    mimetype: yup
      .string()
      .oneOf(
        ["image/jpeg", "image/jpg", "image/png"],
        "image must be oneof .jpg .jpeg .png"
      ),
    size: yup
      .number()
      .max(10000000, "Maksimum ukuran lampiran foto adalah 10MB"),
  };
}
