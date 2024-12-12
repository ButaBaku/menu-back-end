import express from "express";
import { isAuthendicatedUser } from "../middlewares/auth.js";
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  updateProductImage,
} from "../controllers/product.controllers.js";
import upload from "../config/multer.config.js";

const router = express.Router();

router
  .route("/")
  .get(isAuthendicatedUser, getProducts)
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
  .get(isAuthendicatedUser, getProduct)
  .put(isAuthendicatedUser, updateProduct)
  .delete(isAuthendicatedUser, deleteProduct);

router.route("/:id/update-image").post(
  isAuthendicatedUser,
  (req, res, next) => {
    req.folder = "products";
    next();
  },
  upload.single("image"),
  updateProductImage
);

export default router;
