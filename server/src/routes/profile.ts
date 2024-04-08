import express from "express";
import { verifyToken } from "../middleware/auth";
import { getProfile, updateProfile } from "../controllers/profile";
import { validateProfile } from "../validations/profile";

const router = express.Router();

router
  .route("/:id")
  .get(verifyToken, getProfile)
  .put(verifyToken, validateProfile, updateProfile);

export default router;
