import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { userSchema } from "../lib/validations.js";
import logger from "../config/winston.config.js";

const prisma = new PrismaClient();

//! Register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  logger.info("Attempt to register user", { email });

  // Validate user input
  const { error } = userSchema.safeParse({ email, password });
  if (error) {
    logger.warn("Validation error", {
      email,
      message: error.errors[0].message,
    });
    return next(new ErrorHandler(error.errors[0].message, 400));
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  await prisma.user
    .create({
      data: {
        email,
        password: hashedPassword,
      },
    })
    .then(() => {
      logger.info("User registered successfully", { email });
    })
    .catch((error) => {
      logger.error("Failed to register user", { email, error: error.message });
      return next(new ErrorHandler("This user already exists", 400));
    });

  res.status(201).send({
    message: "User registered successfully",
  });
});

//! Login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  logger.info("Attempt to login user", { email });

  // Validate user input
  const { error } = userSchema.safeParse({ email, password });
  if (error) {
    logger.warn("Validation error", {
      email,
      message: error.errors[0].message,
    });
    return next(new ErrorHandler(error.errors[0].message, 400));
  }

  const user = await prisma.user
    .findUnique({
      where: { email },
    })
    .catch((error) => {
      logger.error("Error while fetching user", {
        email,
        error: error.message,
      });
      return next(new ErrorHandler("Invalid credentials", 401));
    });

  if (!user) {
    logger.warn("Login failed - User not found", { email });
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    logger.warn("Login failed - Incorrect password", { email });
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "24h" }
  );

  logger.info("User logged in successfully", { email });
  res.status(200).send({ accessToken: token });
});
