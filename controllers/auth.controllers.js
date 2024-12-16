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
  try {
    const { email, password } = req.body;

    logger.info("İstifadəçi qeydiyyatdan keçməyə çalışır", { email });

    // 1. Validate user input
    const { error } = userSchema.safeParse({ email, password });
    if (error) {
      const errorMessage =
        error.errors[0].message || "Daxil edilən məlumatda səhv var";
      logger.warn("Doğrulama xətası", {
        email,
        message: errorMessage,
      });
      return next(new ErrorHandler(errorMessage, 400));
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // 3. Create a new user in the database
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    logger.info("İstifadəçi uğurla qeydiyyatdan keçdi", { email });
    res.status(201).send({
      message: "İstifadəçi uğurla qeydiyyatdan keçdi",
    });
  } catch (error) {
    // Handle Prisma "unique constraint" error
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      logger.warn("Qeydiyyat uğursuz oldu - İstifadəçi artıq mövcuddur", {
        email,
      });
      return next(new ErrorHandler("Bu istifadəçi artıq mövcuddur", 400));
    }

    // Handle any other unexpected error
    logger.error("Gözlənilməz xəta baş verdi", {
      message: error.message,
      stack: error.stack,
    });
    return next(
      new ErrorHandler(
        "Xidmət müvəqqəti əlçatmazdır, bir az sonra yenidən cəhd edin",
        500
      )
    );
  }
});

//! Login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    logger.info("İstifadəçi daxil olmağa çalışır", { email });

    // 1. Validate user input
    const { error } = userSchema.safeParse({ email, password });
    if (error) {
      const errorMessage = error.errors[0].message || "Məlumatda səhv var";
      logger.warn("Doğrulama xətası", {
        email,
        message: errorMessage,
      });
      return next(new ErrorHandler(errorMessage, 400));
    }

    // 2. Find user in database
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      logger.warn("Daxil olma uğursuz oldu - İstifadəçi tapılmadı", { email });
      return next(new ErrorHandler("İstifadəçi adı və ya şifrə səhvdir", 401));
    }

    // 3. Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn("Daxil olma uğursuz oldu - Yanlış şifrə", { email });
      return next(new ErrorHandler("İstifadəçi adı və ya şifrə səhvdir", 401));
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    logger.info("İstifadəçi uğurla daxil oldu", { email });
    res.status(200).send({ accessToken: token });
  } catch (error) {
    logger.error("Gözlənilməz xəta baş verdi", {
      message: error.message,
      stack: error.stack,
    });
    return next(
      new ErrorHandler(
        "Xidmət müvəqqəti əlçatmazdır, bir az sonra yenidən cəhd edin",
        500
      )
    );
  }
});
