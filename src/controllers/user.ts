import type { NextFunction, Request, Response } from "express";
import type { UserController } from "../interfaces/user";
import userValidation from "../validations/user";
import response from "../middlewares/response";
import { readFileSync, unlinkSync } from "fs";
import { deleteImg, uploadImg } from "../lib/imagekit";
import GlobalConstant from "../constant/global";
import { User } from "../models";
import broker from "../broker";

export default new (class Controller implements UserController {
  public async updateProfileImg(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { filename } = await userValidation.changeProfileImgInput(req.file);
      const { UUID, imageId } = req.user;

      const dirr = `${GlobalConstant.uploadDirr}/${filename}`;
      const { fileId, url } = await uploadImg({
        fileName: filename,
        folder: "profile",
        path: readFileSync(dirr),
      });

      unlinkSync(dirr);

      await User.update(
        { imageUrl: url, imageId: fileId },
        { where: { UUID } }
      );

      if (imageId) await deleteImg(imageId);

      broker.sendMessageToQueue("User-Change-Profile", {
        id: UUID,
        image_url: url,
        image_id: fileId,
      });

      response({ res, code: 200, message: "success" });
    } catch (err) {
      next(err);
    }
  }
  public async updateBackgroundImg(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { filename } = await userValidation.changeProfileImgInput(req.file);
      const { UUID, backgroundId } = req.user;

      const dirr = `${GlobalConstant.uploadDirr}/${filename}`;
      const { fileId, url } = await uploadImg({
        fileName: filename,
        folder: "profile",
        path: readFileSync(dirr),
      });

      unlinkSync(dirr);

      await User.update(
        { backgroundUrl: url, backgroundId: fileId },
        { where: { UUID } }
      );

      if (backgroundId) await deleteImg(backgroundId);

      broker.sendMessageToQueue("User-Change-Background", {
        id: UUID,
        background_id: fileId,
        background_url: url,
      });

      response({ res, code: 200, message: "success" });
    } catch (err) {
      next(err);
    }
  }
})();
