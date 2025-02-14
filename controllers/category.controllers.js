import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { PrismaClient } from "@prisma/client";
import { categorySchema } from "../lib/validations.js";
import logger from "../config/winston.config.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const __dirname = path.resolve("public/");

// Get all categories
export const getCategories = catchAsyncErrors(async (req, res, next) => {
  try {
    logger.info("Bütün kateqoriyaların əldə edilməsi üçün sorğu başladı", {
      method: req.method,
      url: req.originalUrl,
    });

    const categories = await prisma.category.findMany({
      include: {
        subCategories: {
          select: {
            id: true,
            titleEN: true,
            titleAZ: true,
            position: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    logger.info("Kateqoriyalar uğurla əldə edildi", {
      categoryCount: categories.length,
    });

    res.status(200).send(categories.sort((a, b) => a.createdAt - b.createdAt));
  } catch (error) {
    // Handle Prisma known request errors
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error("Prisma sorğusu zamanı xəta baş verdi", {
        errorCode: error.code,
        message: error.message,
      });

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

// Get single category
export const getCategory = catchAsyncErrors(async (req, res, next) => {
  try {
    logger.info("Tək bir kateqoriyanın əldə edilməsi", {
      method: req.method,
      url: req.originalUrl,
      categoryId: req.params.id,
    });

    const categoryId = parseInt(req.params.id);

    if (isNaN(categoryId)) {
      logger.warn("Kateqoriya ID-si rəqəm olmalıdır", {
        categoryId: req.params.id,
      });
      return next(
        new ErrorHandler("Kateqoriya ID-si düzgün formatda deyil", 400)
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        subCategories: {
          select: {
            id: true,
            titleEN: true,
            titleAZ: true,
            position: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!category) {
      logger.warn("Kateqoriya tapılmadı", { categoryId });
      return next(new ErrorHandler("Bu ID ilə kateqoriya tapılmadı", 404));
    }

    logger.info("Kateqoriya uğurla əldə edildi", { categoryId });
    res.status(200).send(category);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error("Prisma sorğusu zamanı xəta baş verdi", {
        errorCode: error.code,
        message: error.message,
        categoryId: req.params.id,
      });

      if (error.code === "P2025") {
        return next(new ErrorHandler("Bu ID ilə kateqoriya mövcud deyil", 404));
      }
    }

    logger.error("Gözlənilməz xəta baş verdi", {
      message: error.message,
      stack: error.stack,
      categoryId: req.params.id,
    });

    return next(
      new ErrorHandler(
        "Xidmət müvəqqəti əlçatmazdır, bir az sonra yenidən cəhd edin",
        500
      )
    );
  }
});

// Create new category
export const createCategory = catchAsyncErrors(async (req, res, next) => {
  logger.info("Yeni kateqoriyanın yaradılması", {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });

  try {
    // Məlumatların alınması və fayl yolunun yaradılması
    const formData = req.body;

    if (!req.file) {
      logger.warn("Şəkil yüklənmədi", { url: req.originalUrl });
      return next(new ErrorHandler("Şəkil tələb olunur", 400));
    }

    const imagePath = `${req.headers.origin}/${req.file?.filename}`;

    // Validasiyanın yoxlanılması
    const { error } = categorySchema.safeParse({
      titleEN: formData.titleEN,
      titleAZ: formData.titleAZ,
      position: formData.position && Number(formData.position),
    });

    if (error) {
      logger.warn("Validasiyadan keçmədi", { validationErrors: error.errors });
      return next(new ErrorHandler(error.errors[0].message, 400));
    }

    // Yeni kateqoriya yaradılır
    const category = await prisma.category.create({
      data: {
        titleEN: formData.titleEN,
        titleAZ: formData.titleAZ,
        position: Number(formData.position),
        image: imagePath,
      },
    });

    logger.info("Kateqoriya uğurla yaradıldı", { categoryId: category.id });
    res.status(201).send(category);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error("Prisma sorğusu zamanı xəta baş verdi", {
        errorCode: error.code,
        message: error.message,
      });

      if (
        error.code === "P2002" &&
        (error.meta.target[0] === "titleEN" ||
          error.meta.target[0] === "titleAZ")
      ) {
        return next(new ErrorHandler("Bu başlıq artıq mövcuddur", 409));
      }

      if (error.code === "P2002" && error.meta.target[0] === "position") {
        return next(new ErrorHandler("Bu pozisiya artıq doludur", 409));
      }
    }

    if (error.name === "MulterError") {
      logger.error("Fayl yükləmə xətası baş verdi", { message: error.message });
      return next(new ErrorHandler("Fayl yükləmə zamanı xəta baş verdi", 400));
    }

    logger.error("Gözlənilməz xəta baş verdi", {
      message: error.message,
      stack: error.stack,
    });

    next(
      new ErrorHandler(
        "Xidmət müvəqqəti əlçatmazdır, bir az sonra yenidən cəhd edin",
        500
      )
    );
  }
});

// Update category
export const updateCategory = catchAsyncErrors(async (req, res, next) => {
  logger.info("Kateqoriyanın yenilənməsi", {
    method: req.method,
    url: req.originalUrl,
    categoryId: req.params.id,
    body: req.body,
  });

  try {
    // Məlumatların alınması
    const data = req.body;

    const categoryId = parseInt(req.params.id);

    if (isNaN(categoryId)) {
      logger.warn("Kateqoriya ID-si rəqəm olmalıdır", {
        categoryId: req.params.id,
      });
      return next(
        new ErrorHandler("Kateqoriya ID-si düzgün formatda deyil", 400)
      );
    }

    // Kateqoriyanın yenilənməsi
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        titleEN: data.titleEN,
        titleAZ: data.titleAZ,
        position: Number(data.position) ? Number(data.position) : undefined,
      },
    });

    logger.info("Kateqoriya uğurla yeniləndi", { categoryId: req.params.id });
    res.status(200).send(category);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error("Prisma xətası baş verdi", {
        errorCode: error.code,
        message: error.message,
        categoryId: req.params.id,
      });

      if (
        error.code === "P2002" &&
        (error.meta.target[0] === "titleEN" ||
          error.meta.target[0] === "titleAZ")
      ) {
        return next(new ErrorHandler("Bu başlıq artıq mövcuddur", 409));
      }

      if (error.code === "P2002" && error.meta.target[0] === "position") {
        return next(new ErrorHandler("Bu pozisiya artıq doludur", 409));
      }

      // P2025 xətası - Record Not Found
      if (error.code === "P2025") {
        return next(new ErrorHandler("Kateqoriya tapılmadı", 404));
      }
    }

    if (error.name === "MulterError") {
      logger.error("Fayl yükləmə xətası baş verdi", { message: error.message });
      return next(new ErrorHandler("Fayl yükləmə zamanı xəta baş verdi", 400));
    }

    logger.error("Gözlənilməz xəta baş verdi", {
      message: error.message,
      stack: error.stack,
      categoryId: req.params.id,
    });

    next(
      new ErrorHandler(
        "Xidmət müvəqqəti əlçatmazdır, bir az sonra yenidən cəhd edin",
        500
      )
    );
  }
});

// Delete category
export const deleteCategory = catchAsyncErrors(async (req, res, next) => {
  logger.info("Kateqoriyanın silinməsi prosesi başladı", {
    method: req.method,
    url: req.originalUrl,
    categoryId: req.params.id,
  });

  try {
    const categoryId = parseInt(req.params.id);

    if (isNaN(categoryId)) {
      logger.warn("Kateqoriya ID-si rəqəm olmalıdır", {
        categoryId: req.params.id,
      });
      return next(
        new ErrorHandler("Kateqoriya ID-si düzgün formatda deyil", 400)
      );
    }

    // Kateqoriyanın silinməsi
    const category = await prisma.category.delete({
      where: { id: categoryId },
      include: {
        subCategories: {
          include: {
            products: true,
          },
        },
      },
    });

    if (category.image) {
      const filePath = decodeURIComponent(new URL(category.image).pathname);
      fs.unlinkSync(path.join(__dirname, filePath));
    }

    category.subCategories.forEach((subcategory) => {
      subcategory.products.forEach(async (product) => {
        if (product.image) {
          const filePath = decodeURIComponent(new URL(product.image).pathname);
          fs.unlinkSync(path.join(__dirname, filePath));
        }
      });
    });

    logger.info("Kateqoriya uğurla silindi", { categoryId: req.params.id });
    res.status(204).send({ message: "Kateqoriya uğurla silindi" });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error("Prisma xətası baş verdi", {
        errorCode: error.code,
        message: error.message,
        categoryId: req.params.id,
      });

      // P2025 xətası - Record Not Found
      if (error.code === "P2025") {
        return next(new ErrorHandler("Kateqoriya tapılmadı", 404));
      }
    }

    logger.error("Gözlənilməz xəta baş verdi", {
      message: error.message,
      stack: error.stack,
      categoryId: req.params.id,
    });

    next(
      new ErrorHandler(
        "Xidmət müvəqqəti əlçatmazdır, bir az sonra yenidən cəhd edin",
        500
      )
    );
  }
});
