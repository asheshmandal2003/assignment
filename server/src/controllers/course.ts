import { Request, Response } from "express";
import { prisma } from "../utils/prismaClient";

export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany();
    return res.status(200).json(courses);
  } catch (err) {
    return res.status(500).json("Internal server error!");
  } finally {
    await prisma.$disconnect();
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, description, category, level } = req.body;
    const newCourse = await prisma.course.create({
      select: {
        id: true,
      },
      data: {
        title,
        description,
        category,
        level,
      },
    });
    return res.status(201).json({ id: newCourse.id });
  } catch (err) {
    return res.status(500).json("Internal server error!");
  } finally {
    prisma.$disconnect();
  }
};
