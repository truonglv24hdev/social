import UserSchema from "../user/user.model";
import { DataStoreInToken, TokenData } from "modules/auth";
import { isEmptyObject } from "../../core/utils";
import { HttpException } from "../../core/exceptions";
import bcrypt from "bcryptjs";
import IUser from "../user/user.interface";
import jwt from "jsonwebtoken";
import LoginDto from "./auth.dto";

class AuthService {
  public userSchema = UserSchema;

  public async login(model: LoginDto): Promise<TokenData> {
    if (isEmptyObject(model)) {
      throw new HttpException(400, "Model is empty");
    }

    const user = await this.userSchema.findOne({ email: model.email });
    if (!user) {
      throw new HttpException(409, "Your email is not exist");
    }

    const checkPassword = await bcrypt.compare(model.password!, user.password);
    if (!checkPassword) {
      throw new HttpException(401, "Incorrect password");
    }

    return this.createToken(user);
  }

  public async getCurrentLoginUser(userId: string): Promise<IUser> {
    const user = await this.userSchema.findById(userId);
    if (!user) {
      throw new HttpException(409, "Your is not exist");
    }

    return user;
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

export default AuthService;
