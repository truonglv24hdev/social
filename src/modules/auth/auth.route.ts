import { Route } from "core/interface";
import { Router } from "express";
import AuthController from "./auth.controller";
import authMiddleware  from "../../core/middleware/auth.middleware";

export default class AuthRoute implements Route {
  public path = "/api/auth";
  public router = Router();

  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, this.authController.login);
    this.router.get(this.path,authMiddleware, this.authController.getCurrentLoginUser);
  }
}
