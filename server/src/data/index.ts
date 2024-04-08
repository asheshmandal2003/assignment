import { Level } from "@prisma/client";
import { courses } from "./courses";
import { prisma } from "../utils/prismaClient";

const insertCourses = async () => {
  try {
    await prisma.course.deleteMany();
    const formattedData = courses.map((course) => ({
      ...course,
      level: course.level as Level | undefined,
    }));

    await prisma.course.createMany({
      data: formattedData,
    });
    console.info("Data inserted successfully");
  } catch (err: any) {
    console.error(err.message);
  } finally {
    await prisma.$disconnect();
  }
};

insertCourses();
