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

    if (!first_name) {
      throw new CustomError(400, "First name cannot be empty!");
    } else if (typeof first_name !== "string") {
      throw new CustomError(400, "First name must be a string!");
    } else if (first_name.trim() === "") {
      throw new CustomError(400, "First name cannot be empty!");
    } else if (first_name.length < 3 || first_name.length > 50) {
      throw new CustomError(
        400,
        "First name must be between 3 and 50 characters!"
      );
    }

    if (!last_name) {
      throw new CustomError(400, "Last name cannot be empty!");
    } else if (typeof last_name !== "string") {
      throw new CustomError(400, "Last name must be a string!");
    } else if (last_name.trim() === "") {
      throw new CustomError(400, "Last name cannot be empty!");
    } else if (last_name.length < 3 || last_name.length > 50) {
      throw new CustomError(
        400,
        "Last name must be between 3 and 50 characters!"
      );
    }

    if (!email) {
      throw new CustomError(400, "Email cannot be empty!");
    } else if (typeof email !== "string") {
      throw new CustomError(400, "Email must be a string!");
    } else if (email.trim() === "") {
      throw new CustomError(400, "Email cannot be empty!");
    } else if (!EMAIL_REGEX.test(email)) {
      throw new CustomError(400, "Invalid email!");
    }

    next();
  } catch (err: any) {
    return res
      .status(err.status || 500)
      .json({ msg: err.message || "Internal Server Error!" });
  }
};

export const validateProfilePhoto = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      throw new CustomError(400, "Please upload a file!");
    }

    const { prevFilename } = req.body;

    if (!prevFilename) {
      throw new CustomError(400, "Previous file name is required!");
    }

    next();
  } catch (err: any) {
    return res
      .status(err.status || 500)
      .json({ msg: err.message || "Internal Server Error!" });
  }
};
