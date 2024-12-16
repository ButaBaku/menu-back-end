import express from "express";
import { isAuthendicatedUser } from "../middlewares/auth.js";
import {
  getCampaigns,
  getCampaign,
  createCampaign,
  deleteCampaign,
  updateCampaign,
} from "../controllers/campaign.controllers.js";
import upload from "../config/multer.config.js";
import { PrismaClient } from "@prisma/client";

import logger from "../config/winston.config.js";

const router = express.Router();

const prisma = new PrismaClient();

router
  .route("/")
  .get(getCampaigns)
  .post(
    isAuthendicatedUser,
    (req, res, next) => {
      req.folder = "campaigns";
      next();
    },
    upload.single("image"),
    createCampaign
  );

router
  .route("/:id")
  .get(getCampaign)
  .put(
    isAuthendicatedUser,
    (req, res, next) => {
      req.folder = "campaigns";
      next();
    },
    upload.single("image"),
    async (req, res, next) => {
      try {
        if (req.file?.filename) {
          await prisma.campaign.update({
            where: { id: parseInt(req.params.id) },
            data: {
              image: `http://${req.headers.host}/${req.file.filename}`,
            },
          });
          logger.info("Şəkil uğurla yeniləndi", { campaignId: req.params.id });
        }
        next();
      } catch (error) {
        logger.error("Kampaniya yenilənərkən xəta baş verdi", {
          error: error.message,
          campaignId: req.params.id,
        });

        if (error.code === "P2025") {
          // Prisma-specific error when the record to update is not found
          return next(new ErrorHandler("Kampaniya tapılmadı", 404));
        } else {
          return next(
            new ErrorHandler("Kampaniya yenilənərkən xəta baş verdi", 500)
          );
        }
      }
    },
    updateCampaign
  )
  .delete(isAuthendicatedUser, deleteCampaign);

export default router;
