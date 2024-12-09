import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";

import { PrismaClient } from "@prisma/client";

import { subCategorySchema } from "../lib/validations.js";

const prisma = new PrismaClient();

export const getSubcategories = catchAsyncErrors(async (req, res, next) => {
  const subcategories = await prisma.subCategory
    .findMany({
      include: {
        category: true,
        products: true,
      },
    })
    .catch((error) => {
      return next(new ErrorHandler(error.message, 400));
    });

  res.status(200).send(subcategories);
});

export const getSubcategory = catchAsyncErrors(async (req, res, next) => {
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
      return next(new ErrorHandler("Subcategory not found", 404));
    });

  if (!subcategory) {
    return next(new ErrorHandler("Subcategory not found", 404));
  }

  res.status(200).send(subcategory);
});

export const createSubcategory = catchAsyncErrors(async (req, res, next) => {
  const { titleEN, titleAZ, categoryId } = req.body;

  // Validate user input
  const { error } = subCategorySchema.safeParse({
    titleEN: titleEN,
    titleAZ: titleAZ,
    categoryId: categoryId,
  });
  if (error) return next(new ErrorHandler(error.errors[0].message, 400));

  const subcategory = await prisma.subCategory
    .create({
      data: {
        titleEN,
        titleAZ,
        categoryId,
      },
    })
    .catch((error) => {
      return next(new ErrorHandler(error.message, 400));
    });

  res.status(201).send(subcategory);
});

export const updateSubcategory = catchAsyncErrors(async (req, res, next) => {
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
      return next(new ErrorHandler(error.message, 404));
    });

  res.status(200).send(subcategory);
});

export const deleteSubcategory = catchAsyncErrors(async (req, res, next) => {
  const subcategory = await prisma.subCategory
    .delete({
      where: {
        id: parseInt(req.params.id),
      },
    })
    .catch((error) => {
      return next(new ErrorHandler(error.message, 404));
    });

  res.status(204).send({ message: "Category deleted successfully" });
});
