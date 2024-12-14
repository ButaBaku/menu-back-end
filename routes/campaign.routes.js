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
      if (req.file?.filename) {
        await prisma.campaign
          .update({
            where: { id: parseInt(req.params.id) },
            data: {
              image: `http://${req.headers.host}/${req.file.filename}`,
            },
          })
          .catch((error) => {
            logger.error("Error updating campaign", {
              error: error.message,
              campaignId: req.params.id,
            });
            return next(new ErrorHandler("Campaign not found", 404));
          });
      }
      next();
    },
    updateCampaign
  )
  .delete(isAuthendicatedUser, deleteCampaign);

export default router;
