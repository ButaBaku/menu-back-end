import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//! Register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 8);

  await prisma.user
    .create({
      data: {
        email,
        password: hashedPassword,
      },
    })
    .catch((error) => {
      return next(new ErrorHandler("This user already exists", 400));
    });

  res.status(201).send({
    message: "User registered successfully",
  });
});

//! Login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return next(new ErrorHandler("Invalid credentials", 401));

  // Generate token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );

  res.status(200).send({ accessToken: token });
});
