import express from "express";
import { isAuthendicatedUser } from "../middlewares/auth.js";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  // updateCategoryImage,
} from "../controllers/category.controllers.js";
import upload from "../config/multer.config.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();

const prisma = new PrismaClient();

router
  .route("/")
  .get(getCategories)
  .post(
    isAuthendicatedUser,
    (req, res, next) => {
      req.folder = "categories";
      next();
    },
    upload.single("image"),
    createCategory
  );

router
  .route("/:id")
  .get(getCategory)
  .put(
    isAuthendicatedUser,
    (req, res, next) => {
      req.folder = "categories";
      next();
    },
    upload.single("image"),
    async (req, res, next) => {
      if (req.file?.filename) {
        await prisma.category
          .update({
            where: { id: parseInt(req.params.id) },
            data: {
              image: `http://${req.headers.host}/${req.file.filename}`,
            },
          })
          .catch((error) => {
            logger.error("Error updating category", {
              error: error.message,
              categoryId: req.params.id,
            });
            return next(new ErrorHandler("Category not found", 404));
          });
      }
      next();
    },
    updateCategory
  )
  .delete(isAuthendicatedUser, deleteCategory);

// router.route("/:id/update-image").post(
//   isAuthendicatedUser,
//   (req, res, next) => {
//     req.folder = "categories";
//     next();
//   },
//   upload.single("image"),
//   updateCategoryImage
// );

export default router;
