import BaseRoutes from "../base/router";
import auth from "./auth";
import user from "./user";

class Router extends BaseRoutes {
  routes(): void {
    this.router.use("/auth", auth).use("/user", user);
  }
}

export default new Router().router;
