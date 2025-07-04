import jwt from "jsonwebtoken";
import { Response } from "express";

// Creating token and setting cookie
export const generateTokenAndSetCookie = (
  res: Response,
  userId: string
): string => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    httpOnly: true, // only accessible by the web server to prevent XSS attacks
    secure: true, // set to true if using HTTPS
    sameSite: "none", // helps prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
  return token;
};
