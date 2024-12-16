import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";

export const isAuthendicatedUser = catchAsyncErrors(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return next(
      new ErrorHandler("Giriş qadağandır. Token təqdim edilməyib", 401)
    );

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err)
      return next(
        new ErrorHandler("Etibarsız və ya müddəti bitmiş token", 403)
      );
    req.user = user;
    next();
  });
});
