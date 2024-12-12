import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { PrismaClient } from "@prisma/client";
import { categorySchema } from "../lib/validations.js";
import logger from "../config/winston.config.js";

const prisma = new PrismaClient();

// Get all categories
export const getCategories = catchAsyncErrors(async (req, res, next) => {
  logger.info("Fetching all categories", {
    method: req.method,
    url: req.originalUrl,
  });

  const categories = await prisma.category
    .findMany({
      include: {
        subCategories: {
          select: {
            id: true,
            titleEN: true,
            titleAZ: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })
    .catch((error) => {
      logger.error("Error fetching categories", { error: error.message });
      return next(new ErrorHandler(error.message, 500));
    });

  logger.info("Successfully fetched categories", {
    categoryCount: categories.length,
  });
  res.status(200).send(categories);
});

// Get single category
export const getCategory = catchAsyncErrors(async (req, res, next) => {
  logger.info("Fetching single category", {
    method: req.method,
    url: req.originalUrl,
    categoryId: req.params.id,
  });

  const category = await prisma.category
    .findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        subCategories: {
          select: {
            id: true,
            titleEN: true,
            titleAZ: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })
    .catch((error) => {
      logger.error("Error fetching category", {
        error: error.message,
        categoryId: req.params.id,
      });
      return next(new ErrorHandler("Category not found", 404));
    });

  if (!category) {
    logger.warn("Category not found", { categoryId: req.params.id });
    return next(new ErrorHandler("Category not found", 404));
  }

  logger.info("Successfully fetched category", { categoryId: req.params.id });
  res.status(200).send(category);
});

// Create new category
export const createCategory = catchAsyncErrors(async (req, res, next) => {
  logger.info("Creating new category", {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });

  try {
    const formData = req.body;
    const imagePath = `/${req.file.filename}`;

    const { error } = categorySchema.safeParse({
      titleEN: formData.titleEN,
      titleAZ: formData.titleAZ,
    });

    if (error) {
      logger.warn("Validation failed", { validationErrors: error.errors });
      return next(new ErrorHandler(error.errors[0].message, 400));
    }

    const category = await prisma.category.create({
      data: {
        titleEN: formData.titleEN,
        titleAZ: formData.titleAZ,
        image: imagePath,
      },
    });

    logger.info("Category created successfully", { categoryId: category.id });
    res.status(201).send(category);
  } catch (error) {
    logger.error("Error creating category", { error: error.message });
    next(new ErrorHandler(error.message, 500));
  }
});

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

// Delete category
export const deleteCategory = catchAsyncErrors(async (req, res, next) => {
  logger.info("Deleting category", {
    method: req.method,
    url: req.originalUrl,
    categoryId: req.params.id,
  });

  await prisma.category
    .delete({
      where: { id: parseInt(req.params.id) },
    })
    .catch((error) => {
      logger.error("Error deleting category", {
        error: error.message,
        categoryId: req.params.id,
      });
      return next(new ErrorHandler("Category not found", 404));
    });

  logger.info("Category deleted successfully", { categoryId: req.params.id });
  res.status(204).send({ message: "Category deleted successfully" });
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
      data: { image: `/${req.file.filename}` },
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
