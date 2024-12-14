import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { PrismaClient } from "@prisma/client";
import { categorySchema } from "../lib/validations.js";
import logger from "../config/winston.config.js";

const prisma = new PrismaClient();

// Update category
export const updateCategory = catchAsyncErrors(async (req, res, next) => {
  logger.info("Updating category", {
    method: req.method,
    url: req.originalUrl,
    categoryId: req.params.id,
    body: req.body,
  });

  const data = req.body;

  const category = await prisma.category
    .update({
      where: { id: parseInt(req.params.id) },
      data: {
        titleEN: data.titleEN,
        titleAZ: data.titleAZ,
      },
    })
    .catch((error) => {
      logger.error("Error updating category", {
        error: error.message,
        categoryId: req.params.id,
      });
      return next(new ErrorHandler("Category not found", 404));
    });

  logger.info("Category updated successfully", { categoryId: req.params.id });
  res.status(200).send(category);
});

// Update category image
export const updateCategoryImage = catchAsyncErrors(async (req, res, next) => {
  logger.info("Updating category image", {
    method: req.method,
    url: req.originalUrl,
    categoryId: req.params.id,
  });

  const category = await prisma.category
    .update({
      where: { id: parseInt(req.params.id) },
      data: { image: `http://${req.headers.host}/${req.file.filename}` },
    })
    .catch((error) => {
      logger.error("Error updating category image", {
        error: error.message,
        categoryId: req.params.id,
      });
      return next(new ErrorHandler("Category not found", 404));
    });

  logger.info("Category image updated successfully", {
    categoryId: req.params.id,
  });
  res.status(200).send(category);
});
