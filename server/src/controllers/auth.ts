import { Request, Response } from "express";
import { hashPassword, matchPassword } from "../utils/auth";
import { prisma } from "../utils/prismaClient";
import { CustomError } from "../../error/CustomError";
import jwt from "jsonwebtoken";
import { sendMail } from "../emails/sendMail";

export const register = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;
    // await sendMail(
    //   email,
    //   "Welcome to our platform!",
    //   "<h1>Welcome to our platform!</h1>"
    // );
    const hash = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: hash,
        role,
      },
    });
    return res.status(201).json(user);
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  } finally {
    await prisma.$disconnect();
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        password: true,
        role: true,
        enrolled: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new CustomError(400, `No user found with email id ${email}!`);
    }

    if (!matchPassword(password, user.password)) {
      throw new CustomError(401, `Wrong password!`);
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLogin: new Date(),
      },
    });

    const resData = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email,
      role: user.role,
      enrolled: user.enrolled,
      createdAt: user.createdAt,
    };

    jwt.sign(
      { id: user.id, email },
      String(process.env.TOKEN_SECRET),
      { expiresIn: "1h" },
      (error, token) => {
        if (error) {
          throw new CustomError(500, `Internal server error!`);
        }
        return res.status(200).json({ user: resData, token });
      }
    );
  } catch (err: any) {
    return res.status(err.status).json({ msg: err.message });
  } finally {
    await prisma.$disconnect();
  }
};
