import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { PrismaClient } from "@prisma/client";
import { productSchema } from "../lib/validations.js";
import logger from "../config/winston.config.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const __dirname = path.resolve("public/");

// Get all products
export const getProducts = catchAsyncErrors(async (req, res, next) => {
  try {
    logger.info("Bütün məhsulların əldə edilməsi üçün sorğu başladı", {
      method: req.method,
      url: req.originalUrl,
    });

    const products = await prisma.product.findMany({
      include: {
        subCategory: {
          include: {
            category: true,
          },
        },
      },
    });

    logger.info("Məhsullar uğurla əldə olundu", {
      productCount: products.length,
    });

    res.status(200).send(products.sort((a, b) => a.position - b.position));
  } catch (error) {
    // Handle Prisma known request errors
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error("Prisma sorğusu zamanı xəta baş verdi", {
        errorCode: error.code,
        message: error.message,
      });

      // Handle specific Prisma error codes
      if (error.code === "P2021") {
        return next(
          new ErrorHandler("Məlumat bazası sorğusunda xəta baş verdi", 500)
        );
      } else if (error.code === "P2002") {
        return next(
          new ErrorHandler(
            "Məlumat bazasında təkrarlanan məlumat aşkarlandı",
            400
          )
        );
      }
    }

    // Catch all other unexpected errors
    logger.error("Gözlənilməz xəta baş verdi", {
      message: error.message,
      stack: error.stack,
    });

    return next(
      new ErrorHandler(
        "Xidmət müvəqqəti əlçatmazdır, bir az sonra yenidən cəhd edin",
        500
      )
    );
  }
});

// Get single product
export const getProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    logger.info("Tək bir məhsulun əldə edilməsi", {
      method: req.method,
      url: req.originalUrl,
      productId: req.params.id,
    });

    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      logger.warn("Məhsul ID-si rəqəm olmalıdır", {
        productId: req.params.id,
      });
      return next(new ErrorHandler("Məhsul ID-si düzgün formatda deyil", 400));
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        subCategory: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!product) {
      logger.warn("Məhsul tapılmadı", { productId });
      return next(new ErrorHandler("Bu ID ilə məhsul tapılmadı", 404));
    }

    logger.info("Məhsul uğurla əldə edildi", { productId });
    res.status(200).send(product);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error("Prisma sorğusu zamanı xəta baş verdi", {
        errorCode: error.code,
        message: error.message,
        productId: req.params.id,
      });

      if (error.code === "P2025") {
        return next(new ErrorHandler("Bu ID ilə məhsul mövcud deyil", 404));
      }
    }

    logger.error("Gözlənilməz xəta baş verdi", {
      message: error.message,
      stack: error.stack,
      productId: req.params.id,
    });

    return next(
      new ErrorHandler(
        "Xidmət müvəqqəti əlçatmazdır, bir az sonra yenidən cəhd edin",
        500
      )
    );
  }
});

// Create new product
export const createProduct = catchAsyncErrors(async (req, res, next) => {
  logger.info("Yeni məhsulun yaradılması", {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });

  try {
    // Məlumatların alınması və fayl yolunun yaradılması
    const formData = req.body;

    const imagePath = `http://${req.headers.host}/${req.file?.filename}`;

    // Validasiyanın yoxlanılması
    const { error } = productSchema.safeParse({
      titleEN: formData.titleEN,
      titleAZ: formData.titleAZ,
      price: formData.price,
      subCategoryId: formData.subCategoryId && Number(formData.subCategoryId),
    });

    if (error) {
      logger.warn("Validasiyadan keçmədi", { validationErrors: error.errors });
      return next(new ErrorHandler(error.errors[0].message, 400));
    }

    // Yeni məhsul yaradılır
    const product = await prisma.product.create({
      data: {
        titleEN: formData.titleEN,
        titleAZ: formData.titleAZ,
        descEN: formData.descEN,
        descAZ: formData.descAZ,
        price: formData.price,
        image: req?.file && imagePath,
        gram: formData.gram,
        isCombo: formData.isCombo === "true",
        ingridientsAZ: formData.ingridientsAZ,
        ingridientsEN: formData.ingridientsEN,
        position: Number(formData.position)
          ? Number(formData.position)
          : undefined,
        subCategoryId: Number(formData.subCategoryId),
      },
    });

    logger.info("Məhsul uğurla yaradıldı", { productId: product.id });
    res.status(201).send(product);
  } catch (error) {
    // Prisma xətası
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error("Məhsul yaradılarkən Prisma xətası baş verdi", {
        errorCode: error.code,
        message: error.message,
      });

      if (error.code === "P2002") {
        return next(
          new ErrorHandler(
            "Bu məlumat artıq mövcuddur, təkrarlanan məlumat aşkarlanıb",
            409
          )
        );
      }
    }

    // Fayl yükləmə xətası
    if (error.name === "MulterError") {
      logger.error("Fayl yükləmə xətası baş verdi", { message: error.message });
      return next(new ErrorHandler("Fayl yükləmə zamanı xəta baş verdi", 400));
    }

    // Gözlənilməz xətalar
    logger.error("Məhsul yaradılarkən gözlənilməz xəta baş verdi", {
      message: error.message,
      stack: error.stack,
    });

    return next(
      new ErrorHandler(
        "Xidmət müvəqqəti əlçatmazdır, bir az sonra yenidən cəhd edin",
        500
      )
    );
  }
});

// Update product
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  logger.info("Məhsulun yenilənməsi", {
    method: req.method,
    url: req.originalUrl,
    productId: req.params.id,
    body: req.body,
  });

  try {
    const data = req.body;

    console.log(Boolean(data.isCombo));
    console.log(typeof Boolean(data.isCombo));

    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      logger.warn("Məhsul ID-si rəqəm olmalıdır", {
        productId: req.params.id,
      });
      return next(new ErrorHandler("Məhsul ID-si düzgün formatda deyil", 400));
    }

    // Məhsulun yenilənməsi
    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        titleEN: data.titleEN,
        titleAZ: data.titleAZ,
        descEN: data.descEN,
        descAZ: data.descAZ,
        price: data.price,
        gram: data.gram,
        isCombo: data.isCombo ? data.isCombo === "true" : undefined,
        ingridientsAZ: data.ingridientsAZ,
        ingridientsEN: data.ingridientsEN,
        position: Number(data.position) ? Number(data.position) : undefined,
        subCategoryId: Number(data.subCategoryId)
          ? Number(data.subCategoryId)
          : undefined,
      },
    });

    logger.info("Məhsul uğurla yeniləndi", { productId: req.params.id });
    res.status(200).send(product);
  } catch (error) {
    // Prisma xətası
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error("Məhsul yenilənərkən Prisma xətası baş verdi", {
        errorCode: error.code,
        message: error.message,
        productId: req.params.id,
      });

      // P2025 - Record Not Found
      if (error.code === "P2025") {
        return next(new ErrorHandler("Məhsul tapılmadı", 404));
      }
    }

    // Fayl yükləmə xətası
    if (error.name === "MulterError") {
      logger.error("Fayl yükləmə xətası baş verdi", { message: error.message });
      return next(new ErrorHandler("Fayl yükləmə zamanı xəta baş verdi", 400));
    }

    // Gözlənilməz xətalar
    logger.error("Gözlənilməz xəta baş verdi", {
      message: error.message,
      stack: error.stack,
      productId: req.params.id,
    });

    next(
      new ErrorHandler(
        "Xidmət müvəqqəti əlçatmazdır, bir az sonra yenidən cəhd edin",
        500
      )
    );
  }
});

export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  logger.info("Məhsulun silinməsi", {
    method: req.method,
    url: req.originalUrl,
    productId: req.params.id,
  });

  try {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      logger.warn("Məhsul ID-si rəqəm olmalıdır", {
        productId: req.params.id,
      });
      return next(new ErrorHandler("Məhsul ID-si düzgün formatda deyil", 400));
    }

    // Məhsulun silinməsi
    const product = await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    if (product.image) {
      const filePath = decodeURIComponent(new URL(product.image).pathname);
      fs.unlinkSync(path.join(__dirname, filePath));
    }

    logger.info("Məhsul uğurla silindi", { productId: req.params.id });
    res.status(204).send();
  } catch (error) {
    // Prisma xətası
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error("Prisma xətası baş verdi", {
        errorCode: error.code,
        message: error.message,
        productId: req.params.id,
      });

      // P2025 - Record Not Found
      if (error.code === "P2025") {
        return next(new ErrorHandler("Məhsul tapılmadı", 404));
      }
    }

    // Gözlənilməz xətalar
    logger.error("Məhsul silinərkən gözlənilməz xəta baş verdi", {
      message: error.message,
      stack: error.stack,
      productId: req.params.id,
    });

    next(
      new ErrorHandler(
        "Xidmət müvəqqəti əlçatmazdır, bir az sonra yenidən cəhd edin",
        500
      )
    );
  }
});
