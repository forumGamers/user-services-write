import BaseRoutes from "../base/router";
import authentication from "../middlewares/authentication";
import controller from "../controllers/user";
import multer from "../middlewares/multer";

export default new (class Routes extends BaseRoutes {
  routes(): void {
    this.router
      .use(authentication)
      .patch("/info", controller.updateUserInfo)
      .post("/profile-img", multer.single("image"), controller.updateProfileImg)
      .post(
        "/background-img",
        multer.single("image"),
        controller.updateBackgroundImg
      );
  }
})().router;
