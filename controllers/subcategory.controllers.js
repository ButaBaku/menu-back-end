import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { PrismaClient } from "@prisma/client";
import { subCategorySchema } from "../lib/validations.js";
import logger from "../config/winston.config.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const __dirname = path.resolve("public/");

// Get all subcategories
export const getSubcategories = catchAsyncErrors(async (req, res, next) => {
  logger.info("Bütün alt kateqoriyaların gətirilməsi prosesi başladı", {
    method: req.method,
    url: req.originalUrl,
  });

  try {
    const subcategories = await prisma.subCategory.findMany({
      include: {
        category: true,
        products: true,
      },
    });

    logger.info("Alt kateqoriyalar uğurla gətirildi", {
      subcategoryCount: subcategories.length,
    });

    res.status(200).send(subcategories.sort((a, b) => a.position - b.position));
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

// Get a single subcategory
export const getSubcategory = catchAsyncErrors(async (req, res, next) => {
  try {
    logger.info("Alt kateqoriyanın gətirilməsi prosesi başladı", {
      method: req.method,
      url: req.originalUrl,
      subcategoryId: req.params.id,
    });

    const subcategoryId = parseInt(req.params.id);

    if (isNaN(subcategoryId)) {
      logger.warn("Alt kateqoriya ID-si rəqəm olmalıdır", {
        subcategoryId: req.params.id,
      });
      return next(
        new ErrorHandler("Alt kateqoriya ID-si düzgün formatda deyil", 400)
      );
    }

    const subcategory = await prisma.subCategory.findUnique({
      where: { id: subcategoryId },
      include: {
        category: true,
        products: true,
      },
    });

    if (!subcategory) {
      logger.warn("Alt kateqoriya tapılmadı", { subcategoryId });
      return next(new ErrorHandler("Alt kateqoriya tapılmadı", 404));
    }

    logger.info("Alt kateqoriya uğurla gətirildi", {
      subcategoryId: req.params.id,
    });

    res.status(200).send(subcategory);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error("Prisma xətası baş verdi", {
        errorCode: error.code,
        message: error.message,
        subcategoryId: req.params.id,
      });

      // P2025 - Record Not Found
      if (error.code === "P2025") {
        return next(new ErrorHandler("Alt kateqoriya tapılmadı", 404));
      }
    }

    logger.error(
      "Alt kateqoriyanın gətirilməsi zamanı gözlənilməz xəta baş verdi",
      {
        message: error.message,
        stack: error.stack,
        subcategoryId: req.params.id,
      }
    );

    next(
      new ErrorHandler(
        "Xidmət müvəqqəti əlçatmazdır, bir az sonra yenidən cəhd edin",
        500
      )
    );
  }
});

// Create a new subcategory
export const createSubcategory = catchAsyncErrors(async (req, res, next) => {
  logger.info("Yeni alt kateqoriyanın yaradılması başladı", {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });

  const { titleEN, titleAZ, position, categoryId } = req.body;

  // Validate user input
  const { error } = subCategorySchema.safeParse({
    titleEN,
    titleAZ,
    position,
    categoryId,
  });

  if (error) {
    logger.warn("Daxil edilən məlumatlar etibarlı deyil", {
      validationErrors: error.errors,
    });
    return next(new ErrorHandler(error.errors[0].message, 400));
  }

  try {
    const existingSubcategory = await prisma.subCategory.findFirst({
      where: {
        position,
        categoryId,
      },
    });

    if (existingSubcategory) {
      logger.warn("Bu pozisiyada alt kateqoriya mövcuddur", {
        position,
        categoryId,
      });
      return next(
        new ErrorHandler("Bu pozisiyada alt kateqoriya mövcuddur", 409)
      );
    }

    const subcategory = await prisma.subCategory.create({
      data: {
        titleEN,
        titleAZ,
        position,
        categoryId,
      },
    });

    logger.info("Alt kateqoriya uğurla yaradıldı", {
      subcategoryId: subcategory.id,
    });

    res.status(201).send(subcategory);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error("Prisma xətası baş verdi", {
        errorCode: error.code,
        message: error.message,
      });

      // Prisma Error: P2002 - Unique constraint failed
      if (error.code === "P2002") {
        return next(
          new ErrorHandler("Bu başlıqla artıq alt kateqoriya mövcuddur", 409)
        );
      }

      // Handle other Prisma errors
      return next(
        new ErrorHandler(
          "Alt kateqoriyanın yaradılması zamanı xəta baş verdi",
          500
        )
      );
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

// Update a subcategory
export const updateSubcategory = catchAsyncErrors(async (req, res, next) => {
  logger.info("Alt kateqoriyanın yenilənməsi", {
    method: req.method,
    url: req.originalUrl,
    subcategoryId: req.params.id,
    body: req.body,
  });

  const { titleEN, titleAZ, categoryId, position } = req.body;

  try {
    const subcategoryId = parseInt(req.params.id);

    if (isNaN(subcategoryId)) {
      logger.warn("Alt kateqoriya ID-si rəqəm olmalıdır", {
        subcategoryId: req.params.id,
      });
      return next(
        new ErrorHandler("Alt kateqoriya ID-si düzgün formatda deyil", 400)
      );
    }

    const subcategory = await prisma.subCategory.findUnique({
      where: {
        id: subcategoryId,
      },
    });

    if (!subcategory) {
      logger.warn("Alt kateqoriya tapılmadı");
      return next(new ErrorHandler("Alt kateqoriya tapılmadı", 404));
    }

    if (position) {
      const existingSubcategory = await prisma.subCategory.findFirst({
        where: {
          position: Number(position),
          categoryId: Number(categoryId)
            ? Number(categoryId)
            : subcategory.categoryId,
        },
      });

      if (existingSubcategory) {
        logger.warn("Bu pozisiyada alt kateqoriya mövcuddur", {
          position,
          categoryId,
        });
        return next(
          new ErrorHandler("Bu pozisiyada alt kateqoriya mövcuddur", 409)
        );
      }
    }

    if (!position && categoryId) {
      const existingSubcategory = await prisma.subCategory.findFirst({
        where: {
          position: subcategory.position,
          categoryId: Number(categoryId),
        },
      });

      if (existingSubcategory) {
        logger.warn("Bu kateqoriyada eyni pozisiyada alt kateqoriya mövcuddur");
        return next(
          new ErrorHandler(
            "Bu kateqoriyada eyni pozisiyada alt kateqoriya mövcuddur",
            409
          )
        );
      }
    }

    // Alt kateqoriyanın yenilənməsi
    const updatedSubcategory = await prisma.subCategory.update({
      where: {
        id: subcategoryId,
      },
      data: {
        titleEN,
        titleAZ,
        position: Number(position) ? Number(position) : undefined,
        categoryId: Number(categoryId) ? Number(categoryId) : undefined,
      },
    });

    logger.info("Alt kateqoriya uğurla yeniləndi", {
      subcategoryId: req.params.id,
    });
    res.status(200).send(updatedSubcategory);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error("Prisma xətası baş verdi", {
        errorCode: error.code,
        message: error.message,
        subcategoryId: req.params.id,
      });

      if (error.code === "P2002") {
        return next(
          new ErrorHandler("Bu başlıqla artıq alt kateqoriya mövcuddur", 409)
        );
      }

      // P2025 xətası - Record Not Found
      if (error.code === "P2025") {
        return next(new ErrorHandler("Alt kateqoriya tapılmadı", 404));
      }
    }

    // Gözlənilməz xətalar
    logger.error("Gözlənilməz xəta baş verdi", {
      message: error.message,
      stack: error.stack,
      subcategoryId: req.params.id,
    });

    return next(
      new ErrorHandler(
        "Xidmət müvəqqəti əlçatmazdır, bir az sonra yenidən cəhd edin",
        500
      )
    );
  }
});

// Delete a subcategory
export const deleteSubcategory = catchAsyncErrors(async (req, res, next) => {
  logger.info("Alt kateqoriyanın silinməsi prosesi başladı", {
    method: req.method,
    url: req.originalUrl,
    subcategoryId: req.params.id,
  });

  try {
    const subcategoryId = parseInt(req.params.id);

    if (isNaN(subcategoryId)) {
      logger.warn("Alt kateqoriya ID-si rəqəm olmalıdır", {
        subcategoryId: req.params.id,
      });
      return next(
        new ErrorHandler("Alt kateqoriya ID-si düzgün formatda deyil", 400)
      );
    }

    // Alt kateqoriyanın silinməsi
    const subcategory = await prisma.subCategory.delete({
      where: {
        id: subcategoryId,
      },
      include: {
        products: true,
      },
    });

    subcategory.products.forEach(async (product) => {
      if (product.image) {
        const filePath = decodeURIComponent(new URL(product.image).pathname);
        fs.unlinkSync(path.join(__dirname, filePath));
      }
    });

    logger.info("Alt kateqoriya uğurla silindi", {
      subcategoryId: req.params.id,
    });
    res.status(204).send({ message: "Alt kateqoriya uğurla silindi" });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error("Prisma xətası baş verdi", {
        errorCode: error.code,
        message: error.message,
        subcategoryId: req.params.id,
      });

      // P2025 xətası - Record Not Found
      if (error.code === "P2025") {
        return next(new ErrorHandler("Alt kateqoriya tapılmadı", 404));
      }

      // Handle other Prisma errors (e.g., foreign key constraint violation)
      return next(
        new ErrorHandler("Alt kateqoriya silinərkən xətalar baş verdi", 400)
      );
    }

    // Gözlənilməz xətalar
    logger.error("Gözlənilməz xəta baş verdi", {
      message: error.message,
      stack: error.stack,
      subcategoryId: req.params.id,
    });

    return next(
      new ErrorHandler(
        "Xidmət müvəqqəti əlçatmazdır, bir az sonra yenidən cəhd edin",
        500
      )
    );
  }
});
