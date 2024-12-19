import express from "express";
import { isAuthendicatedUser } from "../middlewares/auth.js";
import { getInfo, updateInfo } from "../controllers/info.controllers.js";
import upload from "../config/multer.config.js";
import { PrismaClient } from "@prisma/client";
import logger from "../config/winston.config.js";
import ErrorHandler from "../utils/errorHandler.js";
import fs from "fs";
import path from "path";

const router = express.Router();

const prisma = new PrismaClient();
const __dirname = path.resolve("public/");

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
      try {
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

          const info = await prisma.info.findUnique({
            where: { id: 1 },
          });

          if (info.logo && req.files.logo) {
            const filePath = decodeURIComponent(new URL(info.logo).pathname);
            fs.unlinkSync(path.join(__dirname, filePath));
          }

          if (info.backgroundImage && req.files.backgroundImage) {
            const filePath = decodeURIComponent(
              new URL(info.backgroundImage).pathname
            );
            fs.unlinkSync(path.join(__dirname, filePath));
          }

          await prisma.info
            .update({
              where: { id: 1 },
              data,
            })
            .catch((error) => {
              logger.error("Məlumat yenilənərkən xəta baş verdi", {
                error: error.message,
                infoId: 1,
              });
              if (error.code === "P2025") {
                return next(new ErrorHandler("Məlumat tapılmadı", 404));
              }
              return next(
                new ErrorHandler("Məlumat yenilənərkən xəta baş verdi", 500)
              );
            });

          logger.info("Məlumat uğurla yeniləndi");
        }
        next();
      } catch (error) {
        logger.error("Şəkil yüklənərkən xəta baş verdi", {
          error: error.message,
        });
        return next(new ErrorHandler("Şəkil yüklənərkən xəta baş verdi", 500));
      }
    },
    updateInfo
  );

export default router;
