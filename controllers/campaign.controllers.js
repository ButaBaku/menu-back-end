import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { PrismaClient } from "@prisma/client";
import { campaignSchema } from "../lib/validations.js";
import logger from "../config/winston.config.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const __dirname = path.resolve("public/");

export const getCampaigns = catchAsyncErrors(async (req, res, next) => {
  logger.info("Bütün kampaniyaların gətirilməsi", {
    method: req.method,
    url: req.originalUrl,
  });

  try {
    // Kampaniyaların məlumat bazasından gətirilməsi
    const campaigns = await prisma.campaign.findMany();

    logger.info("Kampaniyalar uğurla gətirildi", {
      campaignCount: campaigns.length,
    });

    res.status(200).send(campaigns.sort((a, b) => a.createdAt - b.createdAt));
  } catch (error) {
    // Prisma xətası
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error("Prisma xətası baş verdi", {
        errorCode: error.code,
        message: error.message,
      });

      // Məsələn, P2025 xətası - Record Not Found
      if (error.code === "P2025") {
        return next(new ErrorHandler("Heç bir kampaniya tapılmadı", 404));
      }
    }

    // Gözlənilməz xətalar
    logger.error("Kampaniyalar gətirilərkən gözlənilməz xəta baş verdi", {
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

export const getCampaign = catchAsyncErrors(async (req, res, next) => {
  try {
    logger.info("Kampaniyanın gətirilməsi", {
      method: req.method,
      url: req.originalUrl,
      campaignId: req.params.id,
    });

    const campaignId = parseInt(req.params.id);

    if (isNaN(campaignId)) {
      logger.warn("Kampaniya ID-si rəqəm olmalıdır", {
        campaignId: req.params.id,
      });
      return next(
        new ErrorHandler("Kampaniya ID-si düzgün formatda deyil", 400)
      );
    }

    // Kampaniyanın məlumat bazasından gətirilməsi
    const campaign = await prisma.campaign.findUnique({
      where: {
        id: campaignId,
      },
    });

    // Kampaniya tapılmadıqda
    if (!campaign) {
      logger.warn("Kampaniya tapılmadı", { campaignId: req.params.id });
      return next(new ErrorHandler("Kampaniya tapılmadı", 404));
    }

    logger.info("Kampaniya uğurla gətirildi", { campaignId: req.params.id });
    res.status(200).send(campaign);
  } catch (error) {
    // Prisma xətası
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error("Prisma xətası baş verdi", {
        errorCode: error.code,
        message: error.message,
        campaignId: req.params.id,
      });

      // Məsələn, P2025 xətası - Record Not Found
      if (error.code === "P2025") {
        return next(new ErrorHandler("Kampaniya tapılmadı", 404));
      }
    }

    // Gözlənilməz xətalar
    logger.error("Kampaniya gətirilərkən gözlənilməz xəta baş verdi", {
      message: error.message,
      stack: error.stack,
      campaignId: req.params.id,
    });

    next(
      new ErrorHandler(
        "Xidmət müvəqqəti əlçatmazdır, bir az sonra yenidən cəhd edin",
        500
      )
    );
  }
});

export const createCampaign = catchAsyncErrors(async (req, res, next) => {
  logger.info("Yeni kampaniyanın yaradılması", {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });

  try {
    const formData = req.body;
    const imagePath = `http://${req.headers.host}/${req?.file?.filename}`;

    // İstifadəçi məlumatlarının doğrulanması (validation)
    const { error } = campaignSchema.safeParse({
      titleEN: formData.titleEN,
      titleAZ: formData.titleAZ,
    });

    if (error) {
      logger.warn("Doğrulama uğursuz oldu", { validationErrors: error.errors });
      return next(new ErrorHandler("Daxil edilən məlumatlarda xəta var", 400));
    }

    // Yeni kampaniyanın yaradılması
    const campaign = await prisma.campaign.create({
      data: {
        titleEN: formData.titleEN,
        titleAZ: formData.titleAZ,
        textEN: formData.textEN,
        textAZ: formData.textAZ,
        image: req?.file && imagePath,
      },
    });

    logger.info("Kampaniya uğurla yaradıldı", { campaignId: campaign.id });
    res.status(201).send(campaign);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error("Prisma xətası baş verdi", {
        errorCode: error.code,
        message: error.message,
      });

      // P2002 xətası - Unique constraint failed
      if (error.code === "P2002") {
        return next(new ErrorHandler("Bu məlumatlar artıq mövcuddur", 409));
      }
    }

    if (error.name === "MulterError") {
      logger.error("Fayl yükləmə xətası baş verdi", { message: error.message });
      return next(
        new ErrorHandler(
          "Şəklin yüklənməsi zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.",
          400
        )
      );
    }

    logger.error("Kampaniya yaradılarkən gözlənilməz xəta baş verdi", {
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

export const updateCampaign = catchAsyncErrors(async (req, res, next) => {
  logger.info("Kampaniyanın yenilənməsi", {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });

  try {
    const campaignId = parseInt(req.params.id);

    if (isNaN(campaignId)) {
      logger.warn("Kampaniya ID-si rəqəm olmalıdır", {
        campaignId: req.params.id,
      });
      return next(
        new ErrorHandler("Kampaniya ID-si düzgün formatda deyil", 400)
      );
    }

    const data = req.body;

    const campaign = await prisma.campaign.update({
      where: {
        id: campaignId,
      },
      data: {
        titleEN: data.titleEN,
        titleAZ: data.titleAZ,
        textEN: data.textEN,
        textAZ: data.textAZ,
      },
    });

    if (!campaign) {
      logger.warn("Kampaniya tapılmadı", { campaignId: req.params.id });
      return next(new ErrorHandler("Kampaniya tapılmadı", 404));
    }

    logger.info("Kampaniya uğurla yeniləndi", { campaignId: req.params.id });
    res.status(200).send(campaign);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error("Prisma xətası baş verdi", {
        errorCode: error.code,
        message: error.message,
      });

      // P2025 xətası - Record not found
      if (error.code === "P2025") {
        return next(new ErrorHandler("Kampaniya tapılmadı", 404));
      }
    }

    if (error.name === "MulterError") {
      logger.error("Fayl yükləmə xətası baş verdi", { message: error.message });
      return next(
        new ErrorHandler(
          "Şəklin yüklənməsi zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.",
          400
        )
      );
    }

    logger.error("Kampaniya yenilənərkən gözlənilməz xəta baş verdi", {
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

export const deleteCampaign = catchAsyncErrors(async (req, res, next) => {
  logger.info("Kampaniyanın silinməsi başladı", {
    method: req.method,
    url: req.originalUrl,
    campaignId: req.params.id,
  });

  try {
    const campaignId = parseInt(req.params.id);

    if (isNaN(campaignId)) {
      logger.warn("Kampaniya ID-si etibarsızdır", {
        campaignId: req.params.id,
      });
      return next(new ErrorHandler("Kampaniya ID-si etibarsızdır", 400));
    }

    const campaign = await prisma.campaign.delete({
      where: { id: campaignId },
    });

    if (!campaign) {
      logger.warn("Kampaniya tapılmadı", { campaignId });
      return next(new ErrorHandler("Kampaniya tapılmadı", 404));
    }

    if (campaign.image) {
      const filePath = decodeURIComponent(new URL(campaign.image).pathname);
      fs.unlinkSync(path.join(__dirname, filePath));
    }

    logger.info("Kampaniya uğurla silindi", { campaignId });
    res.status(204).send();
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error("Prisma xətası baş verdi", {
        errorCode: error.code,
        message: error.message,
      });

      // P2025 xətası - Record not found
      if (error.code === "P2025") {
        return next(new ErrorHandler("Silinəcək kampaniya tapılmadı", 404));
      }
    }

    logger.error("Kampaniya silinərkən gözlənilməz xəta baş verdi", {
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
