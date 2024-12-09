import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";

import { PrismaClient } from "@prisma/client";

import { categorySchema } from "../lib/validations.js";

const prisma = new PrismaClient();

// Get all categories

export const getCategories = catchAsyncErrors(async (req, res, next) => {
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
      return next(new ErrorHandler(error.message, 500));
    });

  res.status(200).send(categories);
});

// Get single category
export const getCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await prisma.category
    .findUnique({
      where: {
        id: parseInt(req.params.id),
      },
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
      return next(new ErrorHandler("Category not found", 404));
    });

  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  res.status(200).send(category);
});

// Create new category
export const createCategory = catchAsyncErrors(async (req, res, next) => {
  try {
    const formData = req.body;
    const imagePath = `/${req.file.filename}`;

    // Validate user input
    const { error } = categorySchema.safeParse({
      titleEN: formData.titleEN,
      titleAZ: formData.titleAZ,
    });
    if (error) return next(new ErrorHandler(error.errors[0].message, 400));

    const category = await prisma.category.create({
      data: {
        titleEN: formData.titleEN,
        titleAZ: formData.titleAZ,
        image: imagePath,
      },
    });

    res.status(201).send(category);
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

// Update category
export const updateCategory = catchAsyncErrors(async (req, res, next) => {
  const data = req.body;

  const category = await prisma.category
    .update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        titleEN: data.titleEN,
        titleAZ: data.titleAZ,
      },
    })
    .catch((error) => {
      return next(new ErrorHandler("Category not found", 404));
    });

  res.status(200).send(category);
});

// Delete category
export const deleteCategory = catchAsyncErrors(async (req, res, next) => {
  await prisma.category
    .delete({
      where: {
        id: parseInt(req.params.id),
      },
    })
    .catch((error) => {
      return next(new ErrorHandler("Category not found", 404));
    });

  res.status(204).send({ message: "Category deleted successfully" });
});

// Update category image
export const updateCategoryImage = catchAsyncErrors(async (req, res, next) => {
  const category = await prisma.category
    .update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        image: `/${req.file.filename}`,
      },
    })
    .catch((error) => {
      return next(new ErrorHandler("Category not found", 404));
    });

  res.status(200).send(category);
});
