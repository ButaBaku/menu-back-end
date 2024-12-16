import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import swaggerUi from "swagger-ui-express";

import authRouter from "./routes/auth.routes.js";
import categoryRouter from "./routes/category.routes.js";
import subcategoryRouter from "./routes/subcategory.routes.js";
import productRouter from "./routes/product.routes.js";
import infoRouter from "./routes/info.routes.js";
import campaignRouter from "./routes/campaign.routes.js";

import ErrorHandler from "./utils/errorHandler.js";
import logger from "./config/winston.config.js";

import { specs } from "./config/swagger.config.js";

const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  logger.info(`Gələn sorğu: ${req.method} ${req.url}`);
  next();
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subcategory", subcategoryRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/info", infoRouter);
app.use("/api/v1/campaign", campaignRouter);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));

// 404 xətasını tut və xəta idarəedicisinə ötür
app.use(function (req, res, next) {
  next(new ErrorHandler(`Tapılmadı - ${req.originalUrl}`, 404));
});

// xəta idarəedicisi
app.use(function (err, req, res, next) {
  logger.error(`Xəta baş verdi (${err.statusCode}): ${err.message}`);
  res.status(err.statusCode || 500).send({
    error: err.message || "Daxili server xətası",
  });
});

export default app;
