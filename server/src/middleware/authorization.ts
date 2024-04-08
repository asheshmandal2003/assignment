import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../error/CustomError";
import { prisma } from "../utils/prismaClient";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new CustomError(400, "Invalid request!\nPlease sign in!");
    }

    const user = await prisma.user.findUnique({
      select: {
        role: true,
      },
      where: {
        id,
      },
    });

    if (!user) {
      throw new CustomError(400, "User doesn't exist!");
    }

    if (user.role !== "ADMIN") {
      throw new CustomError(401, "Admin access required!");
    }

    next();
  } catch (err: any) {
    return res.status(err.status).json({ msg: err.message });
  } finally {
    await prisma.$disconnect();
  }
};

export const isUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new CustomError(400, "Invalid request!\nPlease sign in!");
    }

    const user = await prisma.user.findUnique({
      select: {
        role: true,
      },
      where: {
        id,
      },
    });

    console.log(user);

    if (!user) {
      throw new CustomError(400, "User doesn't exist!");
    }

    if (user.role !== "USER") {
      throw new CustomError(401, "User access required!");
    }

    next();
  } catch (err: any) {
    return res.status(err.status).json({ msg: err.message });
  } finally {
    await prisma.$disconnect();
  }
};
