import { NextFunction, Request, Response } from "express";
import ProfileService from "./profile.service";
import IUser from "modules/user/user.interface";
import CreateProfileDto from "./dto/create.profile.dto";
import { IProfile } from "./profile.interface";

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

  // public getCurrentById = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const userId = req.params.id;
  //     const userProfile: Partial<IUser> =
  //       await this.profileService.currentProfile(userId);
  //     res.status(200).json(userProfile);
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public getAllProfile = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const allProfile: Partial<IUser>[] =
  //       await this.profileService.getAllProfile();
  //     res.status(200).json(allProfile);
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public createProfile = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   const profileData: CreateProfileDto = req.body;
  //   const userId = req.user.id;
  //   try {
  //     const createProfile: IProfile = await this.profileService.createProfile(
  //       userId,
  //       profileData
  //     );
  //     res.status(201).json(createProfile);
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public deleteProfile = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   const userId = req.params.id

  //   try {
  //     await this.profileService.deleteProfile(userId)
  //     res.status(200).json({message:"delete success"})
  //   } catch (error) {
  //     next(error)
  //   }
  // };
}

export default ProfileController
