import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { PrismaClient } from "@prisma/client";
import { productSchema } from "../lib/validations.js";
import logger from "../config/winston.config.js";

const prisma = new PrismaClient();

export const getProducts = catchAsyncErrors(async (req, res, next) => {
  logger.info("Fetching all products", {
    method: req.method,
    url: req.originalUrl,
  });

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
      logger.error("Error fetching products", { error: error.message });
      return next(new ErrorHandler(error.message, 500));
    });

  logger.info("Successfully fetched products", {
    productCount: products.length,
  });
  res.status(200).send(products);
});

export const getProduct = catchAsyncErrors(async (req, res, next) => {
  logger.info("Fetching product", {
    method: req.method,
    url: req.originalUrl,
    productId: req.params.id,
  });

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
      logger.error("Error fetching product", {
        error: error.message,
        productId: req.params.id,
      });
      return next(new ErrorHandler(error.message, 404));
    });

  if (!product) {
    logger.warn("Product not found", { productId: req.params.id });
    return next(new ErrorHandler("Product not found", 404));
  }

  logger.info("Successfully fetched product", { productId: req.params.id });
  res.status(200).send(product);
});

export const createProduct = catchAsyncErrors(async (req, res, next) => {
  logger.info("Creating a new product", {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });

  try {
    const formData = req.body;
    const imagePath = `http://${req.headers.host}/${req.file.filename}`;

    // Validate user input
    const { error } = productSchema.safeParse({
      titleEN: formData.titleEN,
      titleAZ: formData.titleAZ,
      descEN: formData.descEN,
      descAZ: formData.descAZ,
      gram: formData.gram,
      subCategoryId: Number(formData.subCategoryId),
    });

    if (error) {
      logger.warn("Validation failed", { validationErrors: error.errors });
      return next(new ErrorHandler(error.errors[0].message, 400));
    }

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

    logger.info("Product created successfully", { productId: product.id });
    res.status(201).send(product);
  } catch (error) {
    logger.error("Error creating product", { error: error.message });
    next(new ErrorHandler(error.message, 500));
  }
});

export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  logger.info("Updating product", {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });

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
      logger.error("Error updating product", {
        error: error.message,
        productId: req.params.id,
      });
      return next(new ErrorHandler(error.message, 404));
    });

  logger.info("Product updated successfully", { productId: req.params.id });
  res.status(200).send(product);
});

export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  logger.info("Deleting product", {
    method: req.method,
    url: req.originalUrl,
    productId: req.params.id,
  });

  await prisma.product
    .delete({
      where: {
        id: parseInt(req.params.id),
      },
    })
    .catch((error) => {
      logger.error("Error deleting product", {
        error: error.message,
        productId: req.params.id,
      });
      return next(new ErrorHandler(error.message, 404));
    });

  logger.info("Product deleted successfully", { productId: req.params.id });
  res.status(204).send();
});

// export const updateProductImage = catchAsyncErrors(async (req, res, next) => {
//   logger.info("Updating product image", {
//     method: req.method,
//     url: req.originalUrl,
//     productId: req.params.id,
//   });

//   const product = await prisma.product
//     .update({
//       where: {
//         id: parseInt(req.params.id),
//       },
//       data: {
//         image: `http://${req.headers.host}/${req.file.filename}`,
//       },
//     })
//     .catch((error) => {
//       logger.error("Error updating product image", {
//         error: error.message,
//         productId: req.params.id,
//       });
//       return next(new ErrorHandler(error.message, 500));
//     });

//   logger.info("Product image updated successfully", {
//     productId: req.params.id,
//   });
//   res.status(200).send(product);
// });
