import { Route } from "core/interface";
import { Router } from "express";
import ProfileController from "./profile.controller";
import validatorMiddleware from "../../core/middleware/validation.middleware";
import CreateProfileDto from "./dto/create.profile.dto";
import { authMiddleware } from "../../core/middleware";

export default class ProfileRoute implements Route {
  public path = "/api/profile";
  public router = Router();

  public profileController = new ProfileController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.post(
    //   this.path,
    //   validatorMiddleware(CreateProfileDto),
    //   this.profileController.createProfile
    // );
    // // this.router.put(
    // //   this.path + "/:id",
    // //   this.profileController.updateUserById
    // // );
    // this.router.get(this.path, this.profileController.getAllProfile);
    this.router.get(this.path,authMiddleware,this.profileController.getCurrentProfile)
    // this.router.get(this.path + "/:id", this.profileController.getCurrentById);
    // this.router.delete(this.path + "/:id", this.profileController.deleteProfile);

  }
}
