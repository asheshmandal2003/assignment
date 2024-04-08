import { NextFunction, Request, Response } from "express";
import { ProfileData } from "../types/profile";
import { CustomError } from "../../error/CustomError";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { first_name, last_name, email }: ProfileData = req.body;

    if (
      first_name === undefined ||
      first_name === null ||
      first_name.trim() === ""
    ) {
      throw new CustomError(400, "First name cannot be empty!");
    } else if (first_name.length < 3 || first_name.length > 50) {
      throw new CustomError(
        400,
        "First name must be between 3 and 50 characters!"
      );
    }

    if (
      last_name === undefined ||
      last_name === null ||
      last_name.trim() === ""
    ) {
      throw new CustomError(400, "Last name cannot be empty!");
    } else if (last_name.length < 3 || last_name.length > 50) {
      throw new CustomError(
        400,
        "Last name must be between 3 and 50 characters!"
      );
    }

    if (email === undefined || email === null || email.trim() === "") {
      throw new CustomError(400, "Email cannot be empty!");
    } else if (!EMAIL_REGEX.test(email)) {
      throw new CustomError(400, "Invalid email!");
    }

    next();
  } catch (err: any) {
    return res.status(err.status).json({ msg: err.message });
  }
};
