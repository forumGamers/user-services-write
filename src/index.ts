import { config } from "dotenv";

config();

import express, { Application } from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";

class App {
  public app: Application;

  constructor() {
    this.app = express();
  }
}

export default new App().app;
