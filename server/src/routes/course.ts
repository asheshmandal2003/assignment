import express from "express";
import { createCourse, getCourses } from "../controllers/course";
import { verifyToken } from "../middleware/auth";
import { isAdmin } from "../middleware/authorization";

const router = express.Router();

router.route("/course").get(getCourses);
router.route("/admin/:id/course").post(verifyToken, isAdmin, createCourse);

export default router;
