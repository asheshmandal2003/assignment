import { NextFunction, Request, Response } from "express";
import { prisma } from "../utils/prismaClient";
import { CustomError } from "../../error/CustomError";
import { registrationData } from "../types/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const checkRegistrationData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { first_name, last_name, email, password }: registrationData =
      req.body;

    if (email === null || email.trim() === "") {
      throw new CustomError(400, "Email cannot be empty!");
    } else if (!EMAIL_REGEX.test(email)) {
      throw new CustomError(400, "Invalid email!");
    }

    const isExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (isExist) {
      throw new CustomError(400, "Email already exists!");
    }

    if (first_name === null || first_name.trim() === "") {
      throw new CustomError(400, "First name cannot be empty!");
    } else if (first_name.length < 3 || first_name.length > 50) {
      throw new CustomError(
        400,
        "First name must be between 3 and 50 characters!"
      );
    }

    if (last_name === null || last_name.trim() === "") {
      throw new CustomError(400, "Last name cannot be empty!");
    } else if (last_name.length < 3 || last_name.length > 50) {
      throw new CustomError(
        400,
        "Last name must be between 3 and 50 characters!"
      );
    }

    if (password === null || password.trim() === "") {
      throw new CustomError(400, "Password cannot be empty!");
    } else if (password.length < 8 || password.length > 128) {
      throw new CustomError(
        400,
        "Password must be between 8 and 128 characters!"
      );
    }

    next();
  } catch (err: any) {
    return res.status(err.status).json({ msg: err.message });
  }
};
