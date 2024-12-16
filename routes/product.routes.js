import express from "express";
import { isAuthendicatedUser } from "../middlewares/auth.js";
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  // updateProductImage,
} from "../controllers/product.controllers.js";
import upload from "../config/multer.config.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();

const prisma = new PrismaClient();

router
  .route("/")
  .get(getProducts)
  .post(
    isAuthendicatedUser,
    (req, res, next) => {
      req.folder = "products";
      next();
    },
    upload.single("image"),
    createProduct
  );

router
  .route("/:id")
  .get(getProduct)
  .put(
    isAuthendicatedUser,
    (req, res, next) => {
      req.folder = "products";
      next();
    },
    upload.single("image"),
    async (req, res, next) => {
      try {
        if (req.file?.filename) {
          await prisma.product.update({
            where: { id: parseInt(req.params.id) },
            data: {
              image: `http://${req.headers.host}/${req.file.filename}`,
            },
          });
          logger.info("Şəkil uğurla yeniləndi", { productId: req.params.id });
        }
        next();
      } catch (error) {
        logger.error("Məhsul yenilənərkən xəta baş verdi", {
          error: error.message,
          productId: req.params.id,
        });

        if (error.code === "P2025") {
          // Prisma-specific error when the record to update is not found
          next(new ErrorHandler("Məhsul tapılmadı", 404));
        } else {
          next(new ErrorHandler("Məhsul yenilənərkən xəta baş verdi", 500));
        }
      }
    },
    updateProduct
  )
  .delete(isAuthendicatedUser, deleteProduct);

export default router;
