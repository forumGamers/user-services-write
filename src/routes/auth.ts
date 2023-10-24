import BaseRoutes from "../base/router";
import Controller from "../controllers/auth";
import authentication from "../middlewares/authentication";

class Routes extends BaseRoutes {
  routes(): void {
    this.router
      .post("/register", Controller.register)
      .post("/login", Controller.login)
      .post("/google-login", Controller.googleLogin)
      .post("/forget-password", Controller.generateForgetPasswordToken)
      .patch(
        "/change-forget-pass",
        authentication,
        Controller.changeForgetPass
      );
  }
}

export default new Routes().router;
