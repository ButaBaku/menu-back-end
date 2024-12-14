import express from "express";
import { isAuthendicatedUser } from "../middlewares/auth.js";
import upload from "../config/multer.config.js";

const router = express.Router();

// router.route("/").put(isAuthendicatedUser, createCategory);

// router.route("/update-image").post(
//   isAuthendicatedUser,
//   (req, res, next) => {
//     req.folder = "info";
//     next();
//   },
//   upload.single("image"),
//   updateCategoryImage
// );

export default router;
