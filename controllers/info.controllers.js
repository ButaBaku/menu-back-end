import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { PrismaClient } from "@prisma/client";
import logger from "../config/winston.config.js";

const prisma = new PrismaClient();

// Update category
export const updateInfo = catchAsyncErrors(async (req, res, next) => {
  logger.info("Updating info", {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });

  const formData = req.body;

  const category = await prisma.info
    .update({
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
    })
    .catch((error) => {
      logger.error("Error updating info", {
        error: error.message,
        categoryId: req.params.id,
      });
      return next(new ErrorHandler("Info not found", 404));
    });

  logger.info("Info updated successfully");
  res.status(200).send(category);
});
