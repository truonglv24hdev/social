import IUser from "modules/user/user.interface";
import {
  IEducation,
  IExperience,
  IProfile,
  ISocial,
  IFollower,
} from "./profile.interface";
import profileModel from "./profile.model";
import { HttpException } from "../../core/exceptions";
import CreateProfileDto from "./dto/create.profile.dto";
import userModel from "../../modules/user/user.model";
import AddExperienceDto from "./dto/add_experience.dto";
import AddEducationDto from "./dto/add_education.dto";

class ProfileService {
  public async currentProfile(userId: string): Promise<Partial<IUser>> {
    const user = await profileModel
      .findOne({ user: userId })
      .populate("user", ["first_name", "last_name", "avatar"]); // Ensure "user" is correctly populated

    if (!user) {
      throw new HttpException(404, "Profile not found");
    }

    return user;
  }

  public async createProfile(
    userId: string,
    profileDto: CreateProfileDto
  ): Promise<IProfile> {
    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      youtube,
      facebook,
      twitter,
    } = profileDto;

    const profileFields: Partial<IProfile> = {
      user: userId,
      company,
      location,
      website,
      bio,
      skills: skills,
      status,
    };

    const socialFields: ISocial = {
      youtube: youtube || "",
      facebook: facebook || "",
      twitter: twitter || "",
    };

    profileFields.social = socialFields;

    const profile = await profileModel.findOneAndUpdate(
      { user: userId },
      { $set: profileFields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return profile;
  }

  public async deleteProfile(userId: string) {
    const result = await profileModel.findByIdAndDelete(userId);

    return result;
  }

  public async getAllProfile(): Promise<Partial<IUser>[]> {
    const profiles = await profileModel
      .find()
      .populate("user", ["first_name", "last_name", "avatar"]); // Ensure correct population

    return profiles;
  }

  public async addExperience(userId: string, experience: AddExperienceDto) {
    const newExp = {
      ...experience,
    };

    const profile = await profileModel.findOne({ user: userId });
    if (!profile) {
      throw new HttpException(400, "not found profile");
    }

    profile.experience.unshift(newExp as IExperience);
    await profile.save();

    return profile;
  }

  public async deleteExperience(userId: string, experienceId: string) {
    const profile = await profileModel.findOne({ user: userId });

    if (!profile) {
      throw new HttpException(400, "not found profile");
    }

    profile.experience = profile.experience.filter(
      (exp) => exp._id.toString() !== experienceId
    );
    await profile.save();
    return profile;
  }

  public async addEducation(userId: string, education: AddEducationDto) {
    const newEdu = {
      ...education,
    };

    const profile = await profileModel.findOne({ user: userId });
    if (!profile) {
      throw new HttpException(400, "not found profile");
    }

    profile.education.unshift(newEdu as IEducation);
    await profile.save();

    return profile;
  }

  public async deleteEducation(userId: string, educationId: string) {
    const profile = await profileModel.findOne({ user: userId });

    if (!profile) {
      throw new HttpException(400, "not found profile");
    }

    profile.education = profile.education.filter(
      (exp) => exp._id.toString() !== educationId
    );
    await profile.save();
    return profile;
  }
}

export default ProfileService;
