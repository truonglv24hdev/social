import { HttpException } from "../../core/exceptions";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DataStoreInToken } from "modules/auth";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("x-auth-token");

  if (!token) {
    throw new HttpException(404, "not token");
  }

  try {
    const user = jwt.verify(
      token,
      process.env.JWT_TOKEN_SECRET!
    ) as DataStoreInToken;

    if (!req.user) {
      req.user = { id: "" };
    }

    req.user.id = user.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "token not vail" });
  }
};

export default authMiddleware;
