import express from "express";
import { login, register, verifyEmail } from "../controllers/auth";
import { checkLoginData, checkRegistrationData } from "../validations/auth";
import { upload } from "../../cloudinary";

const router = express.Router();

router
  .route("/register")
  .post(upload.single("picture"), checkRegistrationData, register);
router.route("/login").post(checkLoginData, login);
router.route("/user/:id/token/:token").get(verifyEmail);

export default router;
