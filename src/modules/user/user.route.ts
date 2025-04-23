import { Route } from "core/interface";
import { Router } from "express";
import UsersController from "./user.controller";
import validatorMiddleware from "../../core/middleware/validation.middleware";
import RegisterDto from "./dto/register.dto";

export default class UserRoute implements Route {
  public path = "/api/user";
  public router = Router();

  public userController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      this.path,
      validatorMiddleware(RegisterDto, true),
      this.userController.register
    );
    this.router.put(
      this.path + "/:id",
      validatorMiddleware(RegisterDto, true),
      this.userController.updateUserById
    );
    this.router.get(this.path, this.userController.getAll);
    this.router.get(this.path +'/paging', this.userController.getUserPagination);
    this.router.get(this.path + "/:id", this.userController.getUserById);
    this.router.delete(this.path +'/:id',this.userController.deleteUser)
  }
}
