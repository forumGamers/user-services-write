import { config } from "dotenv";

config();

import express, { Application } from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import { format, utcToZonedTime } from "date-fns-tz";
import routes from "./routes";
import Constant from "./constant/global";
import notFound from "./routes/notFound";
import errorHandler from "./middlewares/errorHandler";
import AppError from "./base/error";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.plugins();
    this.Routes();
    this.errorHandling();
  }

  private plugins(): void {
    this.app.use(
      helmet({
        referrerPolicy: { policy: "same-origin" },
      })
    );
    this.app.use(
      cors({
        origin(requestOrigin, callback) {
          const whiteList = process.env.CORS_LIST ?? "";
          if (whiteList.indexOf(requestOrigin as string) !== -1) {
            callback(null, true);
          } else {
            callback(
              new AppError({
                message: `Not allowed by CORS for URL ${requestOrigin}`,
                statusCode: 403,
              })
            );
          }
        },
      })
    );
    morgan.token("date", () =>
      format(
        utcToZonedTime(new Date(), "Asia/Jakarta"),
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      )
    );
    morgan.format(
      "production",
      '[:date[Asia/Jakarta]] ":method :url" :status :res[content-length] - :response-time ms'
    );
    morgan.format(
      "dev",
      '[:date[Asia/Jakarta]] ":method :url" :status :res[content-length] - :response-time ms'
    );
    this.app.use(morgan("combined"));
    this.app.use(express.static("public"));
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(
      express.urlencoded({
        extended: true,
        limit: "50mb",
        parameterLimit: 100000000,
      })
    );
    this.app.disable("x-powered-by");
  }

  private Routes(): void {
    this.app.use(Constant.baseUrl, routes).use(notFound);
  }

  private errorHandling(): void {
    this.app.use(errorHandler);
  }
}

export default new App().app;
