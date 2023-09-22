import BaseRoutes from "../base/router";
import Controller from "../controllers/auth";

class Routes extends BaseRoutes {
  routes(): void {
    this.router.post("/register", Controller.register);
  }
}

export default new Routes().router;
