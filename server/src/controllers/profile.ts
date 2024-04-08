import { Request, Response } from "express";
import { prisma } from "../utils/prismaClient";
import { ProfileData } from "../types/profile";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
  } catch (error) {
    return res.status(500).json({ msg: "Something went wrong!" });
  } finally {
    await prisma.$disconnect();
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email }: ProfileData = req.body;

    const user = await prisma.user.update({
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
    console.log(user);
    return res.status(200).json({ msg: "Profile updated!" });
  } catch (error) {
    return res.status(500).json({ msg: "Something went wrong!" });
  } finally {
    await prisma.$disconnect();
  }
};
