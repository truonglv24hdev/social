import { Route } from "core/interface";
import express from "express";
import mongoose from "mongoose";
import hpp from "hpp";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { Logger } from "./core/utils";
import { errorMiddleware } from "./core/middleware";

class App {
  public app: express.Application;
  public port: string | number;
  public production: boolean;

  constructor(routes: Route[]) {
    this.app = express();
    this.port = process.env.PORT || 5000;
    this.production = process.env.NODE_ENV == "production" ? true : false;

    this.connectDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeError();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is listening on port ${this.port}`);
    });
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }

  private initializeMiddlewares() {
    if (this.production) {
      this.app.use(hpp());
      this.app.use(helmet());
      this.app.use(morgan("combined"));
      this.app.use(cors({ origin: "your.domain.com", credentials: true }));
    } else {
      this.app.use(morgan("dev"));
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeError() {
    this.app.use(errorMiddleware);
  }

  private async connectDatabase() {
    try {
      const connectString = process.env.MONGODB_URL;
      if (!connectString) {
        Logger.error("not vail");
        return;
      }
      await mongoose.connect(connectString);
      Logger.info("connect success");
    } catch (error) {
      Logger.error("connect fail");
    }
  }
}

export default App;
