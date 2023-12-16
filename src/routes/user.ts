import BaseRoutes from "../base/router";
import authentication from "../middlewares/authentication";
import controller from "../controllers/user";
import multer from "../middlewares/multer";

export default new (class Routes extends BaseRoutes {
  routes(): void {
    this.router
      .use(authentication)
      .post(
        "/profile-img",
        multer.single("image"),
        controller.updateProfileImg
      );
  }
})().router;
