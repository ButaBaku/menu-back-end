import express from "express";
import { isAuthendicatedUser } from "../middlewares/auth.js";
import {
  getSubcategories,
  getSubcategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "../controllers/subcategory.controllers.js";

const router = express.Router();

router
  .route("/")
  .get(getSubcategories)
  .post(isAuthendicatedUser, createSubcategory);

router
  .route("/:id")
  .get(getSubcategory)
  .put(isAuthendicatedUser, updateSubcategory)
  .delete(isAuthendicatedUser, deleteSubcategory);

export default router;
