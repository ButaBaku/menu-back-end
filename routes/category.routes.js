import express from "express";
import { isAuthendicatedUser } from "../middlewares/auth.js";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryImage,
} from "../controllers/category.controllers.js";
import upload from "../config/multer.config.js";

const router = express.Router();

router
  .route("/")
  .get(isAuthendicatedUser, getCategories)
  .post(isAuthendicatedUser, upload.single("image"), createCategory);

router
  .route("/:id")
  .get(isAuthendicatedUser, getCategory)
  .put(isAuthendicatedUser, updateCategory)
  .delete(isAuthendicatedUser, deleteCategory);

router
  .route("/:id/update-image")
  .post(isAuthendicatedUser, upload.single("image"), updateCategoryImage);

export default router;
