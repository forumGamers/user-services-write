import BaseValidation from "../base/validation";
import * as yup from "yup";
import type {
  ChangeInfoInput,
  IUserValidation,
  UserAttributes,
} from "../interfaces/user";
import type { MulterFile } from "../interfaces";

export default new (class UserValidation extends BaseValidation
  implements IUserValidation {
  constructor() {
    super();
  }

  public async changeProfileImgInput(data: any) {
    return await this.validate<MulterFile>(
      yup.object(this.imageValidator),
      data
    );
  }

  public async updateUserInfo(data: any, user: UserAttributes) {
    return await this.validate<ChangeInfoInput>(
      yup.object().shape({
        username: yup
          .string()
          .default(user.username)
          .transform(this.sanitizeForbiddenChar),
        bio: yup
          .string()
          .default(user.bio || "")
          .transform(this.sanitizeForbiddenChar),
      }),
      data
    );
  }
})();
