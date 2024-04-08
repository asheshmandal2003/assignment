import e, { NextFunction, Request, Response } from "express";
import { CreateCourseType, UpdateCourseType } from "../types/course";
import { CustomError } from "../../error/CustomError";

export const validateCreateCourse = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, category, level }: CreateCourseType = req.body;

    if (!title) {
      throw new CustomError(400, "Title is required!");
    } else if (typeof title !== "string") {
      throw new CustomError(400, "Title must be a string!");
    } else if (title.trim() === "") {
      throw new CustomError(400, "Title is required!");
    } else if (title.length < 10 || title.length > 200) {
      throw new CustomError(
        400,
        "Title must be between 10 and 200 characters!"
      );
    }

    if (!description) {
      throw new CustomError(400, "Description is required!");
    } else if (typeof description !== "string") {
      throw new CustomError(400, "Description must be a string!");
    } else if (description.trim() === "") {
      throw new CustomError(400, "Description is required!");
    } else if (description.length < 50 || description.length > 800) {
      throw new CustomError(
        400,
        "Description must be between 50 and 800 characters!"
      );
    }

    if (!category) {
      throw new CustomError(400, "Category is required!");
    } else if (typeof category !== "string") {
      throw new CustomError(400, "Category must be a string!");
    } else if (category.trim() === "") {
      throw new CustomError(400, "Category is required!");
    } else if (category.length < 5 || category.length > 50) {
      throw new CustomError(
        400,
        "Category must be between 5 and 50 characters!"
      );
    }

    if (!level) {
      throw new CustomError(400, "Level is required!");
    } else if (typeof level !== "string") {
      throw new CustomError(400, "Level must be a string!");
    } else if (level.trim() === "") {
      throw new CustomError(400, "Level is required!");
    } else if (!["BEGINNER", "INTERMEDIATE", "ADVANCE"].includes(level)) {
      throw new CustomError(400, "Invalid level!");
    }

    next();
  } catch (err: any) {
    return res
      .status(err.status || 500)
      .json({ msg: err.message || "Internal server error!" });
  }
};

export const validateUpdateCourse = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, category, level }: UpdateCourseType = req.body;

    if (title) {
      if (title.trim() === "") {
        throw new CustomError(400, "Title is required!");
      } else if (title.length < 10 || title.length > 200) {
        throw new CustomError(
          400,
          "Title must be between 10 and 200 characters!"
        );
      }
    }

    if (description) {
      if (typeof description !== "string") {
        throw new CustomError(400, "Description must be a string!");
      } else if (description.trim() === "") {
        throw new CustomError(400, "Description is required!");
      } else if (description.length < 50 || description.length > 800) {
        throw new CustomError(
          400,
          "Description must be between 50 and 800 characters!"
        );
      }
    }

    if (category) {
      if (typeof category !== "string") {
        throw new CustomError(400, "Category must be a string!");
      } else if (category.trim() === "") {
        throw new CustomError(400, "Category is required!");
      } else if (category.length < 5 || category.length > 50) {
        throw new CustomError(
          400,
          "Category must be between 5 and 50 characters!"
        );
      }
    }

    if (level) {
      if (typeof level !== "string") {
        throw new CustomError(400, "Level must be a string!");
      } else if (level.trim() === "") {
        throw new CustomError(400, "Level is required!");
      } else if (!["BEGINNER", "INTERMEDIATE", "ADVANCE"].includes(level)) {
        throw new CustomError(400, "Invalid level!");
      }
    }

    next();
  } catch (err: any) {
    return res
      .status(err.status || 500)
      .json({ msg: err.message || "Internal server error!" });
  }
};
