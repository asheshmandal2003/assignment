import express from "express";
import { login, register } from "../controllers/auth";
import { checkLoginData, checkRegistrationData } from "../validations/auth";

const router = express.Router();

router.route("/register").post(checkRegistrationData, register);
router.route("/login").post(checkLoginData, login);

export default router;
