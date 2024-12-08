import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSubcategories = catchAsyncErrors(async (req, res, next) => {
  const subcategories = await prisma.subCategory.findMany({
    include: {
      category: true,
    },
  });

  res.status(200).send(subcategories);
});

export const getSubcategory = catchAsyncErrors(async (req, res, next) => {
  const subcategory = await prisma.subCategory.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      category: true,
    },
  });

  if (!subcategory) {
    return next(new ErrorHandler("Subcategory not found", 404));
  }

  res.status(200).send(subcategory);
});

export const createSubcategory = catchAsyncErrors(async (req, res, next) => {
  const { titleEN, titleAZ, categoryId } = req.body;

  const subcategory = await prisma.subCategory.create({
    data: {
      titleEN,
      titleAZ,
      categoryId,
    },
  });

  res.status(201).send(subcategory);
});

export const updateSubcategory = catchAsyncErrors(async (req, res, next) => {
  const { titleEN, titleAZ, categoryId } = req.body;

  const subcategory = await prisma.subCategory.update({
    where: {
      id: parseInt(req.params.id),
    },
    data: {
      titleEN,
      titleAZ,
      categoryId,
    },
  });

  res.status(200).send(subcategory);
});

export const deleteSubcategory = catchAsyncErrors(async (req, res, next) => {
  const subcategory = await prisma.subCategory.delete({
    where: {
      id: parseInt(req.params.id),
    },
  });

  res.status(204).send({ message: "Category deleted successfully" });
});
