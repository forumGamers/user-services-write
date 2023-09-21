import BaseRoutes from "../base/router";

class NotFoundRoutes extends BaseRoutes {
  routes(): void {
    this.router.use("/*", this.NotFoundRoutes);
  }
}

export default new NotFoundRoutes().router;
