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
      if (req.file?.filename) {
        await prisma.product
          .update({
            where: { id: parseInt(req.params.id) },
            data: {
              image: `http://${req.headers.host}/${req.file.filename}`,
            },
          })
          .catch((error) => {
            logger.error("Error updating product", {
              error: error.message,
              categoryId: req.params.id,
            });
            return next(new ErrorHandler("Product not found", 404));
          });
      }
      next();
    },
    updateProduct
  )
  .delete(isAuthendicatedUser, deleteProduct);

// router.route("/:id/update-image").post(
//   isAuthendicatedUser,
//   (req, res, next) => {
//     req.folder = "products";
//     next();
//   },
//   upload.single("image"),
//   updateProductImage
// );

export default router;
