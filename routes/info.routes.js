import express from "express";
import { isAuthendicatedUser } from "../middlewares/auth.js";
import { getInfo, updateInfo } from "../controllers/info.controllers.js";
import upload from "../config/multer.config.js";
import { PrismaClient } from "@prisma/client";
import logger from "../config/winston.config.js";
import ErrorHandler from "../utils/errorHandler.js";

const router = express.Router();

const prisma = new PrismaClient();

router
  .route("/")
  .get(getInfo)
  .put(
    isAuthendicatedUser,
    (req, res, next) => {
      req.folder = "info";
      next();
    },
    upload.fields([
      { name: "logo", maxCount: 1 },
      { name: "backgroundImage", maxCount: 1 },
    ]),
    async (req, res, next) => {
      if (req.files?.logo || req.files?.backgroundImage) {
        const data = req.files.logo
          ? {
              logo: `http://${req.headers.host}/${
                req.files?.logo?.at(0).filename
              }`,
            }
          : {};

        if (req.files.backgroundImage) {
          data.backgroundImage = `http://${req.headers.host}/${
            req.files?.backgroundImage?.at(0).filename
          }`;
        }

        await prisma.info
          .update({
            where: { id: 1 },
            data,
          })
          .catch((error) => {
            logger.error("Error updating info", {
              error: error.message,
              categoryId: req.params.id,
            });
            return next(new ErrorHandler("Info not found", 404));
          });
      }
      next();
    },
    updateInfo
  );

export default router;
