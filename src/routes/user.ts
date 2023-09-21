import BaseRoutes from "../base/router";

class Router extends BaseRoutes {
  routes(): void {
    this.router.post("/register", (req, res) => {
      res.status(200).json("ok");
    });
  }
}

export default new Router().router;
