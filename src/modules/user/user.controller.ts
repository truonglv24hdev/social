import e, { NextFunction, Request, Response } from "express";
import UserService from "./user.service";
import RegisterDto from "./dto/register.dto";
import { TokenData } from "modules/auth";
import IUser from "./user.interface";

export default class UsersController {
  private userService = new UserService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: RegisterDto = req.body;
      const tokenData: TokenData = await this.userService.createUser(model);
      res.status(201).json(tokenData);
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public updateUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: RegisterDto = req.body;
      const user = await this.userService.updateUserById(req.params.id, model);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAll();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  public getUserPagination = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const keyword = req.query.keyword as string;
      const page: number = Number(req.query.page) || 1;
      const user = await this.userService.getAllPaging(keyword, page);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.userService.deleteUser(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
