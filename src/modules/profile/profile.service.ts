import IUser from "modules/user/user.interface";
import {
  IEducation,
  IExperience,
  IProfile,
  ISocial,
  IFollower,
  IFriend,
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

  public async follow(toProfileId: string, fromProfileId: string) {
    const toProfile = await profileModel.findOne({ user: toProfileId });
    const fromProfile = await profileModel.findOne({ user: fromProfileId });

    if (!toProfile) {
      throw new HttpException(400, "Not found toProfile");
    }

    if (!fromProfile) {
      throw new HttpException(400, "Not found fromProfile");
    }

    if (
      toProfile.followers &&
      toProfile.followers.some(
        (follower: IFollower) => follower.user.toString() === fromProfileId
      )
    ) {
      throw new HttpException(400, "you have follower fromProfile");
    }

    if (
      fromProfile.following &&
      fromProfile.following.some(
        (follow: IFollower) => follow.user.toString() === toProfileId
      )
    ) {
      throw new HttpException(400, "toProfile have following");
    }

    await toProfile.updateOne(
      { $push: { followers: { user: fromProfileId } } },
      { new: true }
    );
    await fromProfile.updateOne(
      { $push: { following: { user: toProfileId } } },
      { new: true }
    );

    return fromProfile;
  }

  public async unfollow(toProfileId: string, fromProfileId: string) {
    const toProfile = await profileModel.findOne({ user: toProfileId });
    const fromProfile = await profileModel.findOne({ user: fromProfileId });

    if (!toProfile) {
      throw new HttpException(400, "Not found toProfile");
    }

    if (!fromProfile) {
      throw new HttpException(400, "Not found fromProfile");
    }

    if (
      toProfile.followers &&
      !toProfile.followers.some(
        (follower: IFollower) =>
          follower.user.toString() === fromProfileId.toString()
      )
    ) {
      throw new HttpException(400, "you not follower fromProfile");
    }

    if (
      fromProfile.following &&
      !fromProfile.following.some(
        (follow: IFollower) => follow.user.toString() === toProfileId.toString()
      )
    ) {
      throw new HttpException(400, "fromProfile have not following");
    }

    await toProfile.updateOne(
      { $pull: { followers: { user: fromProfileId } } },
      { new: true }
    );
    await fromProfile.updateOne(
      { $pull: { following: { user: toProfileId } } },
      { new: true }
    );

    return fromProfile;
  }

  public async addFriend(toProfileId: string, fromProfileId: string) {
    const toProfile = await profileModel.findOne({ user: toProfileId });
    const fromProfile = await profileModel.findOne({ user: fromProfileId });

    if (!toProfile) {
      throw new HttpException(400, "Not found toProfile");
    }

    if (!fromProfile) {
      throw new HttpException(400, "Not found fromProfile");
    }

    if (
      toProfile.friendRequests &&
      toProfile.friendRequests.some(
        (friendRequest: IFriend) =>
          friendRequest.user.toString() === fromProfileId
      )
    ) {
      throw new HttpException(400, "you have send request fromProfile");
    }

    if (
      toProfile.friends &&
      toProfile.friends.some(
        (friend: IFriend) => friend.user.toString() === toProfileId
      )
    ) {
      throw new HttpException(400, "You have friend fromProfile");
    }

    if (
      fromProfile.friends &&
      fromProfile.friends.some(
        (friend: IFriend) => friend.user.toString() === toProfileId
      )
    ) {
      throw new HttpException(400, "You have friend toProfile");
    }

    await toProfile.updateOne(
      { $push: { friendRequests: { user: fromProfileId, date: Date.now() } } },
      { new: true }
    );

    return toProfile;
  }

  public async acceptFriend(toProfileId: string, fromProfileId: string) {
    const toProfile = await profileModel.findOne({ user: toProfileId });
    const fromProfile = await profileModel.findOne({ user: fromProfileId });

    if (!toProfile) {
      throw new HttpException(400, "Not found toProfile");
    }

    if (!fromProfile) {
      throw new HttpException(400, "Not found fromProfile");
    }

    if (
      toProfile.friendRequests &&
      !toProfile.friendRequests.some(
        (friend: IFriend) => friend.user.toString() === fromProfileId.toString()
      )
    ) {
      throw new HttpException(400, "you not have friend request fromProfile");
    }

    await toProfile.updateOne(
      {
        $pull: { friendRequests: { user: fromProfileId } },
        $push: { friends: { user: fromProfileId } },
      },
      { new: true }
    );
    await fromProfile.updateOne(
      { $push: { friends: { user: toProfileId } } },
      { new: true }
    );

    return fromProfile;
  }

  public async unFriend(toProfileId: string, fromProfileId: string) {
    const toProfile = await profileModel.findOne({ user: toProfileId });
    const fromProfile = await profileModel.findOne({ user: fromProfileId });

    if (!toProfile) {
      throw new HttpException(400, "Not found toProfile");
    }

    if (!fromProfile) {
      throw new HttpException(400, "Not found fromProfile");
    }

    if (
      toProfile.friends &&
      !toProfile.friends.some(
        (friend: IFriend) => friend.user.toString() === fromProfileId.toString()
      )
    ) {
      throw new HttpException(400, "you not friend fromProfile");
    }

    if (
      fromProfile.friends &&
      !fromProfile.friends.some(
        (friend: IFriend) => friend.user.toString() === toProfileId.toString()
      )
    ) {
      throw new HttpException(400, "fromProfile have not friend");
    }

    await toProfile.updateOne(
      { $pull: { friends: { user: fromProfileId } } },
      { new: true }
    );
    await fromProfile.updateOne(
      { $pull: { friends: { user: toProfileId } } },
      { new: true }
    );

    return fromProfile;
  }
}

export default ProfileService;
