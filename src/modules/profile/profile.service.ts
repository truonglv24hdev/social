import IUser from "modules/user/user.interface";
import { IProfile, ISocial } from "./profile.interface";
import profileModel from "./profile.model";
import { HttpException } from "../../core/exceptions";
import CreateProfileDto from "./dto/create.profile.dto";
import normalize from "normalize-url";
import userModel from "modules/user/user.model";

class ProfileService {
  public async currentProfile(userId: string): Promise<Partial<IUser>> {
    const user = await profileModel
      .findOne({ user: userId })
      .populate("user", ["first_name", "last_name", "avatar"]);  // Ensure "user" is correctly populated

    if (!user) {
      throw new HttpException(404, "Profile not found");
    }

    return user;
  }

  // public async createProfile(
  //   userId: string,
  //   profileDto: CreateProfileDto
  // ): Promise<IProfile> {
  //   const {
  //     company,
  //     location,
  //     website,
  //     bio,
  //     skills,
  //     status,
  //     youtube,
  //     facebook,
  //     twitter,
  //   } = profileDto;

  //   const profileFields: Partial<IProfile> = {
  //     user: userId,
  //     company,
  //     location,
  //     website: website ? normalize(website.toString(), { forceHttps: true }) : "",
  //     bio,
  //     skills: Array.isArray(skills)
  //       ? skills
  //       : skills?.split(",").map((skill: string) => skill.trim()),
  //     status,
  //   };

  //   const socialFields: ISocial = {
  //     youtube: youtube ? normalize(youtube, { forceHttps: true }) : "",
  //     facebook: facebook ? normalize(facebook, { forceHttps: true }) : "",
  //     twitter: twitter ? normalize(twitter, { forceHttps: true }) : "",
  //   };

  //   profileFields.social = socialFields;

  //   const profile = await profileModel.findOneAndUpdate(
  //     { user: userId },
  //     { $set: profileFields },
  //     { new: true, upsert: true, setDefaultsOnInsert: true }
  //   );

  //   return profile;
  // }

  // public async deleteProfile(userId: string) {
  //   await profileModel.findOneAndDelete({ user: userId });
  //   await userModel.findOneAndDelete({ _id: userId });
  // }

  // public async getAllProfile(): Promise<Partial<IUser>[]> {
  //   const profiles = await profileModel
  //     .find()
  //     .populate("user", ["first_name", "last_name", "avatar"]);  // Ensure correct population

  //   return profiles;
  // }
}

export default ProfileService;
