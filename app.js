import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import swaggerUi from "swagger-ui-express";

import authRouter from "./routes/auth.routes.js";
import categoryRouter from "./routes/category.routes.js";
import subcategoryRouter from "./routes/subcategory.routes.js";
import productRouter from "./routes/product.routes.js";

import ErrorHandler from "./utils/errorHandler.js";

import { specs } from "./config/swagger.config.js";

const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subcategory", subcategoryRouter);
app.use("/api/v1/product", productRouter);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(new ErrorHandler(`Not found - ${req.originalUrl}`, 404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).send({
    error: err.message || "Internal server error",
  });
});

export default app;
