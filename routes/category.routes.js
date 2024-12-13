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
  .get(getCategories)
  .post(
    isAuthendicatedUser,
    (req, res, next) => {
      req.folder = "categories";
      next();
    },
    upload.single("image", "asdasd"),
    createCategory
  );

router
  .route("/:id")
  .get(getCategory)
  .put(isAuthendicatedUser, updateCategory)
  .delete(isAuthendicatedUser, deleteCategory);

router.route("/:id/update-image").post(
  isAuthendicatedUser,
  (req, res, next) => {
    req.folder = "categories";
    next();
  },
  upload.single("image"),
  updateCategoryImage
);

export default router;
