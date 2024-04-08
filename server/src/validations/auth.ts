import e, { NextFunction, Request, Response } from "express";
import { prisma } from "../utils/prismaClient";
import { CustomError } from "../../error/CustomError";
import { LoginData, RegistrationData } from "../types/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;

export const checkRegistrationData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { first_name, last_name, email, password }: RegistrationData =
      req.body;

    if (!email) {
      throw new CustomError(400, "Email cannot be empty!");
    } else if (typeof email !== "string") {
      throw new CustomError(400, "Email must be a string!");
    } else if (email.trim() === "") {
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

    if (!password) {
      throw new CustomError(400, "Password cannot be empty!");
    } else if (typeof password !== "string") {
      throw new CustomError(400, "Password must be a string!");
    } else if (password.trim() === "") {
      throw new CustomError(400, "Password cannot be empty!");
    } else if (password.length < 8 || password.length > 128) {
      throw new CustomError(
        400,
        "Password must be between 8 and 128 characters!"
      );
    } else if (!PASSWORD_REGEX.test(password)) {
      throw new CustomError(
        400,
        "Password must contain atleast 1 numeric value, 1 special character, 1 capital letter!"
      );
    }

    next();
  } catch (err: any) {
    return res
      .status(err.status || 500)
      .json({ msg: err.message } || { msg: "Internal server error!" });
  }
};

export const checkLoginData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password }: LoginData = req.body;

    if (!email) {
      throw new CustomError(400, "Email cannot be empty!");
    } else if (typeof email !== "string") {
      throw new CustomError(400, "Email must be a string!");
    } else if (email.trim() === "") {
      throw new CustomError(400, "Email cannot be empty!");
    } else if (!EMAIL_REGEX.test(email)) {
      throw new CustomError(400, "Invalid email!");
    }

    if (!password) {
      throw new CustomError(400, "Password cannot be empty!");
    } else if (typeof password !== "string") {
      throw new CustomError(400, "Password must be a string!");
    } else if (password.trim() === "") {
      throw new CustomError(400, "Password cannot be empty!");
    } else if (password.length < 8 || password.length > 128) {
      throw new CustomError(
        400,
        "Password must be between 8 and 128 characters!"
      );
    } else if (!PASSWORD_REGEX.test(password)) {
      throw new CustomError(
        400,
        "Password must contain atleast 1 numeric value, 1 special character, 1 capital letter!"
      );
    }

    next();
  } catch (err: any) {
    return res
      .status(err.status || 500)
      .json({ msg: err.message } || { msg: "Internal server error!" });
  }
};
