import BaseRoutes from "../base/router";
import user from "./user";

class Router extends BaseRoutes {
  routes(): void {
    this.router.use("/users", user);
  }
}

export default new Router().router;
