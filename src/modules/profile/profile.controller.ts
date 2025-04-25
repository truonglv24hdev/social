import { NextFunction, Request, Response } from "express";
import ProfileService from "./profile.service";
import IUser from "modules/user/user.interface";
import CreateProfileDto from "./dto/create.profile.dto";
import { IProfile } from "./profile.interface";
import AddExperienceDto from "./dto/add_experience.dto";
import AddEducationDto from "./dto/add_education.dto";

class ProfileController {
  private profileService = new ProfileService();

  public getCurrentProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const userProfile: Partial<IUser> =
        await this.profileService.currentProfile(userId);
      res.status(200).json(userProfile);
    } catch (error) {
      next(error);
    }
  };

  public getCurrentById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.id;
      const userProfile: Partial<IUser> =
        await this.profileService.currentProfile(userId);
      res.status(200).json(userProfile);
    } catch (error) {
      next(error);
    }
  };

  public getAllProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const allProfile: Partial<IUser>[] =
        await this.profileService.getAllProfile();
      res.status(200).json(allProfile);
    } catch (error) {
      next(error);
    }
  };

  public createProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const profileData: CreateProfileDto = req.body;
    const userId = req.user.id;
    try {
      const createProfile: IProfile = await this.profileService.createProfile(
        userId,
        profileData
      );
      res.status(201).json(createProfile);
    } catch (error) {
      next(error);
    }
  };

  public deleteProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.params.id;

    try {
      await this.profileService.deleteProfile(userId);
      res.status(200).json({ message: "delete success" });
    } catch (error) {
      next(error);
    }
  };

  public addExperience = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const model: AddExperienceDto = req.body;

      const addExperience = await this.profileService.addExperience(
        userId,
        model
      );

      res.status(201).json(addExperience);
    } catch (error) {
      next(error);
    }
  };

  public removeExperience = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const experienceId = req.params.id;

      const result = await this.profileService.deleteExperience(
        userId,
        experienceId
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public addEducation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const model: AddEducationDto = req.body;

      const addEducation = await this.profileService.addEducation(
        userId,
        model
      );

      res.status(201).json(addEducation);
    } catch (error) {
      next(error);
    }
  };

  public removeEducation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const educationId = req.params.id;

      const result = await this.profileService.deleteEducation(
        userId,
        educationId
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public follow = async (req: Request, res: Response, next: NextFunction) => {
    const fromProfileId = req.user.id;
    const toProfileId = req.params.id;

    try {
      const fromProfile = await this.profileService.follow(
        toProfileId,
        fromProfileId
      );
      res.status(200).json(fromProfile);
    } catch (error) {
      next(error);
    }
  };

  public unfollow = async (req: Request, res: Response, next: NextFunction) => {
    const fromProfileId = req.user.id;
    const toProfileId = req.params.id;

    try {
      const fromProfile = await this.profileService.unfollow(
        toProfileId,
        fromProfileId
      );
      res.status(200).json(fromProfile);
    } catch (error) {
      next(error);
    }
  };

  public addFriend = async (req: Request, res: Response, next: NextFunction) => {
    const fromProfileId = req.user.id;
    const toProfileId = req.params.id;

    try {
      const fromProfile = await this.profileService.addFriend(
        toProfileId,
        fromProfileId
      );
      res.status(200).json(fromProfile);
    } catch (error) {
      next(error);
    }
  };

  public acceptFriend = async (req: Request, res: Response, next: NextFunction) => {
    const fromProfileId = req.user.id;
    const toProfileId = req.params.id;

    try {
      const fromProfile = await this.profileService.acceptFriend(
        toProfileId,
        fromProfileId
      );
      res.status(200).json(fromProfile);
    } catch (error) {
      next(error);
    }
  };

  public unFriend = async (req: Request, res: Response, next: NextFunction) => {
    const fromProfileId = req.user.id;
    const toProfileId = req.params.id;

    try {
      const fromProfile = await this.profileService.unFriend(
        toProfileId,
        fromProfileId
      );
      res.status(200).json(fromProfile);
    } catch (error) {
      next(error);
    }
  };
}

export default ProfileController;
