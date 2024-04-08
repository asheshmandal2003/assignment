import { Request, Response } from "express";
import { prisma } from "../utils/prismaClient";
import { ProfileData } from "../types/profile";
import { CustomError } from "../../error/CustomError";
import { isNullId } from "../utils/nullCheck";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isNullId(id)) {
      throw new CustomError(404, "User not found!");
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        first_name: true,
        last_name: true,
        email: true,
        enrolled: true,
        createdAt: true,
      },
    });
    return res.status(200).json(user);
  } catch (err: any) {
    return res
      .status(err.status || 500)
      .json({ msg: err.message || "Something went wrong!" });
  } finally {
    await prisma.$disconnect();
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isNullId(id)) {
      throw new CustomError(404, "User not found!");
    }

    const { first_name, last_name, email }: ProfileData = req.body;

    await prisma.user.update({
      select: {
        id: true,
      },
      where: {
        id,
      },
      data: {
        first_name,
        last_name,
        email,
      },
    });
    return res.status(200).json({ msg: "Profile updated!" });
  } catch (err: any) {
    return res
      .status(err.status || 500)
      .json({ msg: err.message || "Something went wrong!" });
  } finally {
    await prisma.$disconnect();
  }
};

export const enrolledCourses = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isNullId(id)) {
      throw new CustomError(404, "User not found!");
    }

    const enrolledCourses = await prisma.user.findUnique({
      select: {
        enrolled: {
          select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      where: {
        id,
      },
    });
    return res.status(200).json({ courses: enrolledCourses });
  } catch (err: any) {
    return res
      .status(err.status || 500)
      .json({ msg: err.message || "Something went wrong!" });
  }
};
