import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "../../error/CustomError";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers["authorization"];

    if (!token) {
      throw new CustomError(401, "Access token required!!");
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }
    token &&
      jwt.verify(token, String(process.env.TOKEN_SECRET), (err, _user) => {
        if (err) {
          throw new CustomError(401, "Invalid access token!");
        }
      });
    next();
  } catch (err: any) {
    return res.status(err.status).json({ msg: err.message });
  }
};
