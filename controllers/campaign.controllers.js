import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { PrismaClient } from "@prisma/client";
import { campaignSchema } from "../lib/validations.js";
import logger from "../config/winston.config.js";

const prisma = new PrismaClient();

export const getCampaigns = catchAsyncErrors(async (req, res, next) => {
  logger.info("Fetching all campaigns", {
    method: req.method,
    url: req.originalUrl,
  });

  const campaigns = await prisma.campaign.findMany().catch((error) => {
    logger.error("Error fetching campaigns", { error: error.message });
    return next(new ErrorHandler(error.message, 500));
  });

  logger.info("Successfully fetched campaigns", {
    campaignCount: campaigns.length,
  });
  res.status(200).send(campaigns);
});

export const getCampaign = catchAsyncErrors(async (req, res, next) => {
  logger.info("Fetching campaign", {
    method: req.method,
    url: req.originalUrl,
    campaignId: req.params.id,
  });

  const campaign = await prisma.campaign
    .findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    })
    .catch((error) => {
      logger.error("Error fetching campaign", {
        error: error.message,
        campaignId: req.params.id,
      });
      return next(new ErrorHandler(error.message, 404));
    });

  if (!campaign) {
    logger.warn("Campaign not found", { campaignId: req.params.id });
    return next(new ErrorHandler("Campaign not found", 404));
  }

  logger.info("Successfully fetched campaign", { campaignId: req.params.id });
  res.status(200).send(campaign);
});

export const createCampaign = catchAsyncErrors(async (req, res, next) => {
  logger.info("Creating a new campaign", {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });

  try {
    const formData = req.body;
    const imagePath = `http://${req.headers.host}/${req?.file?.filename}`;

    // Validate user input
    const { error } = campaignSchema.safeParse({
      titleEN: formData.titleEN,
      titleAZ: formData.titleAZ,
    });

    if (error) {
      logger.warn("Validation failed", { validationErrors: error.errors });
      return next(new ErrorHandler(error.errors[0].message, 400));
    }

    const campaign = await prisma.campaign.create({
      data: {
        titleEN: formData.titleEN,
        titleAZ: formData.titleAZ,
        textEN: formData.textEN,
        textAZ: formData.textAZ,
        image: req?.file && imagePath,
      },
    });

    logger.info("Campaign created successfully", { campaignId: campaign.id });
    res.status(201).send(campaign);
  } catch (error) {
    logger.error("Error creating campaign", { error: error.message });
    next(new ErrorHandler(error.message, 500));
  }
});

export const updateCampaign = catchAsyncErrors(async (req, res, next) => {
  logger.info("Updating campaign", {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });

  const data = req.body;

  const campaign = await prisma.campaign
    .update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        titleEN: data.titleEN,
        titleAZ: data.titleAZ,
        textEN: data.textEN,
        textAZ: data.textAZ,
      },
    })
    .catch((error) => {
      logger.error("Error updating campaign", {
        error: error.message,
        campaignId: req.params.id,
      });
      return next(new ErrorHandler(error.message, 404));
    });

  logger.info("Campaign updated successfully", { campaignId: req.params.id });
  res.status(200).send(campaign);
});

export const deleteCampaign = catchAsyncErrors(async (req, res, next) => {
  logger.info("Deleting campaign", {
    method: req.method,
    url: req.originalUrl,
    campaignId: req.params.id,
  });

  await prisma.campaign
    .delete({
      where: {
        id: parseInt(req.params.id),
      },
    })
    .catch((error) => {
      logger.error("Error deleting campaign", {
        error: error.message,
        campaignId: req.params.id,
      });
      return next(new ErrorHandler(error.message, 404));
    });

  logger.info("Campaign deleted successfully", { campaignId: req.params.id });
  res.status(204).send();
});
