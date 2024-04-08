import express from "express";
import { verifyToken } from "../middleware/auth";
import {
  enrolledCourses,
  getProfile,
  updateProfile,
} from "../controllers/profile";
import { validateProfile } from "../validations/profile";
import { isUser } from "../middleware/authorization";

const router = express.Router();

router
  .route("/:id")
  .get(verifyToken, getProfile)
  .put(verifyToken, validateProfile, updateProfile);

router.route("/:id/enrolls").get(verifyToken, isUser, enrolledCourses);

export default router;
