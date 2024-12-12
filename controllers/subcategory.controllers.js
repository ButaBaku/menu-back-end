import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { PrismaClient } from "@prisma/client";
import { subCategorySchema } from "../lib/validations.js";
import logger from "../config/winston.config.js";

const prisma = new PrismaClient();

// Get all subcategories
export const getSubcategories = catchAsyncErrors(async (req, res, next) => {
  logger.info("Fetching all subcategories", {
    method: req.method,
    url: req.originalUrl,
  });

  const subcategories = await prisma.subCategory
    .findMany({
      include: {
        category: true,
        products: true,
      },
    })
    .catch((error) => {
      logger.error("Error fetching subcategories", { error: error.message });
      return next(new ErrorHandler(error.message, 400));
    });

  logger.info("Successfully fetched subcategories", {
    subcategoryCount: subcategories.length,
  });
  res.status(200).send(subcategories);
});

// Get a single subcategory
export const getSubcategory = catchAsyncErrors(async (req, res, next) => {
  logger.info("Fetching single subcategory", {
    method: req.method,
    url: req.originalUrl,
    subcategoryId: req.params.id,
  });

  const subcategory = await prisma.subCategory
    .findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        category: true,
        products: true,
      },
    })
    .catch((error) => {
      logger.error("Error fetching subcategory", {
        error: error.message,
        subcategoryId: req.params.id,
      });
      return next(new ErrorHandler("Subcategory not found", 404));
    });

  if (!subcategory) {
    logger.warn("Subcategory not found", { subcategoryId: req.params.id });
    return next(new ErrorHandler("Subcategory not found", 404));
  }

  logger.info("Successfully fetched subcategory", {
    subcategoryId: req.params.id,
  });
  res.status(200).send(subcategory);
});

// Create a new subcategory
export const createSubcategory = catchAsyncErrors(async (req, res, next) => {
  logger.info("Creating new subcategory", {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });

  const { titleEN, titleAZ, categoryId } = req.body;

  // Validate user input
  const { error } = subCategorySchema.safeParse({
    titleEN: titleEN,
    titleAZ: titleAZ,
    categoryId: categoryId,
  });
  if (error) {
    logger.warn("Validation failed", { validationErrors: error.errors });
    return next(new ErrorHandler(error.errors[0].message, 400));
  }

  const subcategory = await prisma.subCategory
    .create({
      data: {
        titleEN,
        titleAZ,
        categoryId,
      },
    })
    .catch((error) => {
      logger.error("Error creating subcategory", { error: error.message });
      return next(new ErrorHandler(error.message, 400));
    });

  logger.info("Subcategory created successfully", {
    subcategoryId: subcategory.id,
  });
  res.status(201).send(subcategory);
});

// Update a subcategory
export const updateSubcategory = catchAsyncErrors(async (req, res, next) => {
  logger.info("Updating subcategory", {
    method: req.method,
    url: req.originalUrl,
    subcategoryId: req.params.id,
    body: req.body,
  });

  const { titleEN, titleAZ, categoryId } = req.body;

  const subcategory = await prisma.subCategory
    .update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        titleEN,
        titleAZ,
        categoryId,
      },
    })
    .catch((error) => {
      logger.error("Error updating subcategory", {
        error: error.message,
        subcategoryId: req.params.id,
      });
      return next(new ErrorHandler(error.message, 404));
    });

  logger.info("Subcategory updated successfully", {
    subcategoryId: req.params.id,
  });
  res.status(200).send(subcategory);
});

// Delete a subcategory
export const deleteSubcategory = catchAsyncErrors(async (req, res, next) => {
  logger.info("Deleting subcategory", {
    method: req.method,
    url: req.originalUrl,
    subcategoryId: req.params.id,
  });

  await prisma.subCategory
    .delete({
      where: {
        id: parseInt(req.params.id),
      },
    })
    .catch((error) => {
      logger.error("Error deleting subcategory", {
        error: error.message,
        subcategoryId: req.params.id,
      });
      return next(new ErrorHandler(error.message, 404));
    });

  logger.info("Subcategory deleted successfully", {
    subcategoryId: req.params.id,
  });
  res.status(204).send({ message: "Subcategory deleted successfully" });
});
