import express from "express";
import { register } from "../controllers/auth";
import { checkRegistrationData } from "../validations/auth";

const router = express.Router();

router.route("/register").post(checkRegistrationData, register);

export default router;
