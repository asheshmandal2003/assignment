import { Request, Response } from "express";
import { prisma } from "../utils/prismaClient";
import { CustomError } from "../../error/CustomError";
import {
  CreateCourseType,
  GetCoursesType,
  UpdateCourseType,
} from "../types/course";
import { isNullId } from "../utils/nullCheck";

export const getCourses = async (req: Request, res: Response) => {
  try {
    let { take, skip, category, level, popularity }: GetCoursesType = req.query;

    if (!take && !skip) {
      throw new CustomError(400, "Please set the take and skip limits!");
    }

    take = Number(take) < 30 ? Number(take) : 30;
    skip = Number(skip);

    if (category && typeof category === "string" && category.trim() !== "") {
      const courses = await prisma.course.findMany({
        where: {
          category,
        },
        take,
        skip,
      });
      return res.status(200).json(courses);
    }

    if (level && ["BEGINNER", "INTERMEDIATE", "ADVANCE"].includes(level)) {
      const courses = await prisma.course.findMany({
        where: {
          level,
        },
        take,
        skip,
      });
      return res.status(200).json(courses);
    }

    if (popularity) {
      popularity = Boolean(popularity);
      const courses = await prisma.course.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          level: true,
          enrolledBy: {
            select: {
              id: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        take,
        skip,
      });
      const response = courses
        .sort(
          (prevCourse, nextCourse) =>
            nextCourse.enrolledBy.length - prevCourse.enrolledBy.length
        )
        .map((course) => ({
          ...course,
          enrolledBy: course.enrolledBy.length,
        }));
      return res.status(200).json(response);
    }

    const courses = await prisma.course.findMany({
      take,
      skip,
    });
    return res.status(200).json(courses);
  } catch (err: any) {
    return res
      .status(err.status || 500)
      .json({ msg: err.message || "Internal server error!" });
  } finally {
    await prisma.$disconnect();
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, description, category, level }: CreateCourseType = req.body;
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
    return res.status(500).json({ msg: "Internal server error!" });
  } finally {
    prisma.$disconnect();
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    if (isNullId(courseId)) {
      throw new CustomError(404, "Course doesn't exist!");
    }

    const { title, description, category, level }: UpdateCourseType = req.body;

    const course = await prisma.course.findUnique({
      select: {
        title: true,
        description: true,
        category: true,
        level: true,
      },
      where: {
        id: courseId,
      },
    });

    if (!course) {
      throw new CustomError(404, "Course not found!");
    }

    if (title && title !== course.title) {
      course.title = title;
    }

    if (description && description !== course.description) {
      course.description = description;
    }

    if (category && category !== course.category) {
      course.category = category;
    }

    if (level && level !== course.level) {
      course.level = level;
    }

    await prisma.course.update({
      where: {
        id: courseId,
      },
      data: course,
    });

    return res.status(204).send();
  } catch (err: any) {
    return res
      .status(err.status || 500)
      .json({ msg: err.message || "Internal server error!" });
  } finally {
    prisma.$disconnect();
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    if (isNullId(courseId)) {
      throw new CustomError(404, "Course doesn't exist!");
    }
    const course = await prisma.course.delete({
      select: {
        title: true,
      },
      where: {
        id: courseId,
      },
    });

    return res.status(200).json({ msg: `Course ${course.title} deleted!` });
  } catch (err: any) {
    return res
      .status(err.status || 500)
      .json({ msg: err.message || "Internal server error!" });
  } finally {
    prisma.$disconnect();
  }
};

export const enroll = async (req: Request, res: Response) => {
  try {
    const { courseId, id } = req.params;

    if (isNullId(courseId)) {
      throw new CustomError(404, "Course doesn't exist!");
    }

    const course = await prisma.course.findUnique({
      select: {
        enrolledBy: {
          select: {
            id: true,
          },
        },
      },
      where: {
        id: courseId,
      },
    });

    if (!course) {
      throw new CustomError(404, "Course not found!");
    }
    if (course.enrolledBy.some((enrollment) => enrollment.id === id)) {
      throw new CustomError(400, "Already enrolled in the course!");
    }

    await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        enrolledBy: {
          connect: {
            id: id,
          },
        },
      },
    });

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        enrolled: {
          connect: {
            id: courseId,
          },
        },
      },
    });

    return res.status(204).send();
  } catch (err: any) {
    return res
      .status(err.status || 500)
      .json({ msg: err.message || "Internal server error!" });
  } finally {
    prisma.$disconnect();
  }
};
