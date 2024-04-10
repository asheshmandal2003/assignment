import { Request, Response } from "express";
import { hashPassword, matchPassword } from "../utils/auth";
import { prisma } from "../utils/prismaClient";
import { CustomError } from "../../error/CustomError";
import jwt from "jsonwebtoken";
import { sendMail } from "../emails/sendMail";
import crypto from "crypto";
import exp from "constants";

export const register = async (req: Request, res: Response) => {
  try {
    console.log(req);
    const { first_name, last_name, email, password, role } = req.body;
    const hash = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        path: req.file?.path,
        filename: req.file?.filename,
        email,
        password: hash,
        role,
      },
    });
    const token = crypto.randomBytes(64).toString("hex");
    await prisma.token.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 180000),
      },
    });
    await sendMail(
      email,
      "Email Verification",
      `Email verification link: http://localhost:${process.env.PORT}/api/v1/auth/user/${user.id}/token/${token}`
    );
    return res.status(201).json({
      msg: `http://localhost:${process.env.PORT}/api/v1/auth/user/${user.id}/token/${token}`,
    });
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

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { id, token } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new CustomError(400, `No user found with id ${id}!`);
    }

    if (user.verified) {
      return res.status(200).json({ msg: "Email already verified!" });
    }

    const tokenData = await prisma.token.findFirst({
      where: {
        userId: id,
        token,
      },
      select: {
        expiresAt: true,
      },
    });

    if (!tokenData) {
      throw new CustomError(400, `Invalid token!`);
    }

    if (Date.now() > tokenData.expiresAt.getTime()) {
      await prisma.token.delete({
        where: {
          userId: id,
          token,
        },
      });
      throw new CustomError(400, `Token expired!`);
    }

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        verified: true,
      },
    });

    return res.status(200).json({ msg: "Email verified successfully!" });
  } catch (err: any) {
    return res.status(err.status).json({ msg: err.message });
  } finally {
    await prisma.$disconnect();
  }
};
