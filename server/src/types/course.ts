import { Level } from "@prisma/client";

export type GetCoursesType = {
  take?: number | string;
  skip?: number | string;
  category?: string;
  level?: Level;
  popularity?: boolean | string;
};

export type CreateCourseType = {
  title: string;
  description: string;
  category: string;
  level: Level;
};

export type UpdateCourseType = {
  title?: string;
  description?: string;
  category?: string;
  level?: Level;
};
