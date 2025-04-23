import UserSchema from "./user.model";
import RegisterDto from "./dto/register.dto";
import { DataStoreInToken, TokenData } from "modules/auth";
import { isEmptyObject } from "../../core/utils";
import { HttpException } from "../../core/exceptions";
import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import IUser from "./user.interface";
import jwt from "jsonwebtoken";
import { IPagination } from "core/interface";
import { email } from "envalid";

class UserService {
  public userSchema = UserSchema;

  public async createUser(model: RegisterDto): Promise<TokenData> {
    if (isEmptyObject(model)) {
      throw new HttpException(400, "Model is empty");
    }

    const user = await this.userSchema.findOne({ email: model.email });
    if (user) {
      throw new HttpException(409, "Your email already exist");
    }

    const avatar = gravatar.url(model.email!, {
      size: "200",
    });

    const slat = bcrypt.genSaltSync(10);

    const hashedPassword = bcrypt.hashSync(model.password!, slat);

    const newUser: IUser = await this.userSchema.create({
      ...model,
      password: hashedPassword,
      avatar: avatar,
    });

    return this.createToken(newUser);
  }

  public async updateUserById(
    userId: string,
    model: RegisterDto
  ): Promise<IUser> {
    if (isEmptyObject(model)) {
      throw new HttpException(400, "Model is empty");
    }

    const user = await this.userSchema.findById(userId);
    if (!user) {
      throw new HttpException(400, "User id not exist");
    }

    let updateUserById;

    if (model.password) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(model.password, salt);
      updateUserById = await this.userSchema.findByIdAndUpdate(
        userId,
        {
          ...model,
          password: hashedPassword,
        },
        { new: true }
      );
    } else {
      updateUserById = await this.userSchema.findByIdAndUpdate(
        userId,
        {
          ...model,
        },
        { new: true }
      );
    }

    if (!updateUserById) throw new HttpException(404, "Update fail");

    return updateUserById;
  }

  public async getUserById(userId: string): Promise<IUser> {
    const user = await this.userSchema.findById(userId);
    if (!user) {
      throw new HttpException(409, "User is not exist");
    }

    return user;
  }

  public async getAll(): Promise<IUser[]> {
    const users = await this.userSchema.find();

    return users;
  }

  public async getAllPaging(
    keyword: string,
    page: number
  ): Promise<IPagination<IUser>> {
    const pageSize = Number(process.env.PAGE_SIZE || 10);

    let query;
    if (keyword) {
      query = this.userSchema
        .find({
          $or: [
            { email: { $regex: keyword, $options: "i" } },
            { first_name: { $regex: keyword, $options: "i" } },
            { last_name: { $regex: keyword, $options: "i" } },
          ],
        })
        .sort({ date: -1 });
    } else {
      query = this.userSchema.find().sort({ date: -1 });
    }

    const users = await this.userSchema
      .find(query)
      .sort({ date: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const countUser = await query.countDocuments();

    return {
      total: countUser,
      page: page,
      pageSize: pageSize,
      items: users,
    } as IPagination<IUser>;
  }

  public async deleteUser(userId: string): Promise<IUser> {
    const result = await this.userSchema.findByIdAndDelete(userId);
    if (!result) {
      throw new HttpException(404, "User not found");
    }
    return result;
  }

  private createToken(user: IUser): TokenData {
    const dataInToken: DataStoreInToken = { id: user._id };
    const secret: string = process.env.JWT_TOKEN_SECRET!;
    const expiresIn: number = 3600;
    return {
      token: jwt.sign(dataInToken, secret, { expiresIn }),
    };
  }
}

export default UserService;
