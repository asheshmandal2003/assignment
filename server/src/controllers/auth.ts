import { Request, Response } from "express";
import { hashPassword } from "../utils/auth";
import { prisma } from "../utils/prismaClient";

export const register = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const hash = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: hash,
      },
    });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  } finally {
    await prisma.$disconnect();
  }
};
