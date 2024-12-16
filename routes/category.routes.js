import express from "express";
import { isAuthendicatedUser } from "../middlewares/auth.js";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controllers.js";
import upload from "../config/multer.config.js";
import { PrismaClient } from "@prisma/client";

import logger from "../config/winston.config.js";

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
      try {
        if (req.file?.filename) {
          await prisma.category.update({
            where: { id: parseInt(req.params.id) },
            data: {
              image: `http://${req.headers.host}/${req.file.filename}`,
            },
          });
          logger.info("Şəkil uğurla yeniləndi", { categoryId: req.params.id });
        }
        next();
      } catch (error) {
        logger.error("Kateqoriya yenilənərkən xəta baş verdi", {
          error: error.message,
          categoryId: req.params.id,
        });

        if (error.code === "P2025") {
          // Prisma-specific error when the record to update is not found
          return next(new ErrorHandler("Kateqoriya tapılmadı", 404));
        } else {
          return next(
            new ErrorHandler("Kateqoriya yenilənərkən xəta baş verdi", 500)
          );
        }
      }
    },
    updateCategory
  )
  .delete(isAuthendicatedUser, deleteCategory);

export default router;
