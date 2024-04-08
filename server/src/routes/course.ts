import express from "express";
import {
  createCourse,
  deleteCourse,
  enroll,
  getCourses,
  updateCourse,
} from "../controllers/course";
import { verifyToken } from "../middleware/auth";
import { isAdmin, isUser } from "../middleware/authorization";
import {
  validateCreateCourse,
  validateUpdateCourse,
} from "../validations/course";

const router = express.Router();

router.route("/course").get(getCourses);
router
  .route("/admin/:id/course")
  .post(verifyToken, isAdmin, validateCreateCourse, createCourse);
router
  .route("/admin/:id/course/:courseId")
  .put(verifyToken, isAdmin, validateUpdateCourse, updateCourse)
  .delete(verifyToken, isAdmin, deleteCourse);
router.route("/course/:courseId/enroll/:id").put(verifyToken, isUser, enroll);

export default router;
