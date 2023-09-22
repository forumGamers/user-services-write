import BaseRoutes from "../base/router";
import auth from "./auth";

class Router extends BaseRoutes {
  routes(): void {
    this.router.use("/auth", auth);
  }
}

export default new Router().router;
