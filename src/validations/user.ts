import BaseValidation from "../base/validation";
import * as yup from "yup";
import type { IUserValidation } from "../interfaces/user";
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
})();
