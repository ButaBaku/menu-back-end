import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { PrismaClient } from "@prisma/client";
import logger from "../config/winston.config.js";

const prisma = new PrismaClient();

// Get info
export const getInfo = catchAsyncErrors(async (req, res, next) => {
  logger.info("Məlumatın alınması başladı", {
    method: req.method,
    url: req.originalUrl,
  });

  try {
    const info = await prisma.info.findUnique({
      where: { id: 1 },
    });

    if (!info) {
      logger.warn("Məlumat tapılmadı", { infoId: 1 });
      return next(new ErrorHandler("Məlumat tapılmadı", 404));
    }

    logger.info("Məlumat uğurla tapıldı");
    res.status(200).send(info);
  } catch (error) {
    logger.error("Məlumat alınarkən gözlənilməz xəta baş verdi", {
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

export const updateInfo = catchAsyncErrors(async (req, res, next) => {
  logger.info("Məlumatın yenilənməsi başladı", {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });

  try {
    const formData = req.body;

    const updatedInfo = await prisma.info.update({
      where: { id: 1 },
      data: {
        titleEN: formData.titleEN,
        titleAZ: formData.titleAZ,
        phoneNumbers: formData.phoneNumbers,
        email: formData.email,
        addressEN: formData.addressEN,
        addressAZ: formData.addressAZ,
        instagram: formData.instagram,
        facebook: formData.facebook,
        whatsapp: formData.whatsapp,
      },
    });

    if (!updatedInfo) {
      logger.warn("Yenilənəcək məlumat tapılmadı", { infoId: 1 });
      return next(new ErrorHandler("Yenilənəcək məlumat tapılmadı", 404));
    }

    logger.info("Məlumat uğurla yeniləndi", { infoId: 1 });
    res.status(200).send(updatedInfo);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error("Prisma xətası baş verdi", {
        errorCode: error.code,
        message: error.message,
      });

      // P2025 xətası - Record not found
      if (error.code === "P2025") {
        return next(new ErrorHandler("Yenilənəcək məlumat tapılmadı", 404));
      }
    }

    logger.error("Məlumat yenilənərkən gözlənilməz xəta baş verdi", {
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
