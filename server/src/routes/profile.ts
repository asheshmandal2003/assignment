import express from "express";
import { verifyToken } from "../middleware/auth";
import {
  enrolledCourses,
  getProfile,
  updateProfile,
  updateProfilePhoto,
} from "../controllers/profile";
import { validateProfile, validateProfilePhoto } from "../validations/profile";
import { isUser } from "../middleware/authorization";
import { upload } from "../../cloudinary";

const router = express.Router();

router
  .route("/:id")
  .get(verifyToken, getProfile)
  .put(verifyToken, validateProfile, updateProfile);
router
  .route("/:id/photo")
  .patch(
    verifyToken,
    upload.single("picture"),
    validateProfilePhoto,
    updateProfilePhoto
  );

router.route("/:id/enrolls").get(verifyToken, isUser, enrolledCourses);

export default router;
