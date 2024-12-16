import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controllers.js";

const router = express.Router();

// router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);

export default router;
