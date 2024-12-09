import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";

import { PrismaClient } from "@prisma/client";

import { productSchema } from "../lib/validations.js";

const prisma = new PrismaClient();

export const getProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await prisma.product
    .findMany({
      include: {
        subCategory: {
          include: {
            category: true,
          },
        },
      },
    })
    .catch((error) => {
      return next(new ErrorHandler(error.message, 500));
    });

  res.status(200).send(products);
});

export const getProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await prisma.product
    .findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        subCategory: {
          include: {
            category: true,
          },
        },
      },
    })
    .catch((error) => {
      return next(new ErrorHandler(error.message, 404));
    });

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).send(product);
});

export const createProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const formData = req.body;
    const imagePath = `/${req.file.filename}`;

    // Validate user input
    const { error } = productSchema.safeParse({
      titleEN: formData.titleEN,
      titleAZ: formData.titleAZ,
      descEN: formData.descEN,
      descAZ: formData.descAZ,
      gram: formData.gram,
      subCategoryId: Number(formData.subCategoryId),
    });
    if (error) return next(new ErrorHandler(error.errors[0].message, 400));

    const product = await prisma.product.create({
      data: {
        titleEN: formData.titleEN,
        titleAZ: formData.titleAZ,
        descEN: formData.descEN,
        descAZ: formData.descAZ,
        price: Number(formData.price),
        image: imagePath,
        gram: formData.gram,
        isCombo: formData.isCombo === "true",
        ingridientsAZ: formData.ingridientsAZ,
        ingridientsEN: formData.ingridientsEN,
        subCategoryId: Number(formData.subCategoryId),
      },
    });

    res.status(201).send(product);
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  const data = req.body;

  const product = await prisma.product
    .update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        titleEN: data.titleEN,
        titleAZ: data.titleAZ,
        descEN: data.descEN,
        descAZ: data.descAZ,
        price: data.price,
        gram: data.gram,
        isCombo: data.isCombo,
        ingridientsAZ: data.ingridientsAZ,
        ingridientsEN: data.ingridientsEN,
        subCategoryId: data.subCategoryId,
      },
    })
    .catch((error) => {
      return next(new ErrorHandler(error.message, 404));
    });

  res.status(200).send(product);
});

export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  await prisma.product
    .delete({
      where: {
        id: parseInt(req.params.id),
      },
    })
    .catch((error) => {
      return next(new ErrorHandler(error.message, 404));
    });

  res.status(204).send();
});

export const updateProductImage = catchAsyncErrors(async (req, res, next) => {
  const product = await prisma.product
    .update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        image: `/${req.file.filename}`,
      },
    })
    .catch((error) => {
      return next(new ErrorHandler(error.message, 500));
    });

  res.status(200).send(product);
});
