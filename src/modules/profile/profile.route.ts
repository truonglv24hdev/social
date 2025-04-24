import { Route } from "core/interface";
import { Router } from "express";
import ProfileController from "./profile.controller";
import validatorMiddleware from "../../core/middleware/validation.middleware";
import CreateProfileDto from "./dto/create.profile.dto";
import { authMiddleware } from "../../core/middleware";
import AddExperienceDto from "./dto/add_experience.dto";
import AddEducationDto from "./dto/add_education.dto";

export default class ProfileRoute implements Route {
  public path = "/api/profile";
  public router = Router();

  public profileController = new ProfileController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      this.path,
      authMiddleware,
      validatorMiddleware(CreateProfileDto, true),
      this.profileController.createProfile
    );
    this.router.get(this.path, this.profileController.getAllProfile);
    this.router.post(
      this.path + "/experience",
      authMiddleware,
      validatorMiddleware(AddExperienceDto, true),
      this.profileController.addExperience
    );
    this.router.delete(
      this.path + "/experience/:id",
      authMiddleware,
      this.profileController.removeExperience
    );
    this.router.post(
      this.path + "/education",
      authMiddleware,
      validatorMiddleware(AddEducationDto, true),
      this.profileController.addEducation
    );
    this.router.delete(
      this.path + "/education/:id",
      authMiddleware,
      this.profileController.removeEducation
    );
    this.router.get(
      this.path,
      authMiddleware,
      this.profileController.getCurrentProfile
    );
    this.router.get(this.path + "/:id", this.profileController.getCurrentById);
    this.router.delete(
      this.path + "/:id",
      this.profileController.deleteProfile
    );
  }
}
