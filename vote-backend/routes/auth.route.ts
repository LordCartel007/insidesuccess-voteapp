// @ts-nocheck
import express from "express";
import {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
  resendVerificationEmail,
  googleLogin,
  createDecisionRoom,
  userFetcher,
} from "../controllers/auth.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Define your routes here

//checking if user is authenticated each time page is refreshed
router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/verify-email", verifyEmail);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post("/resend-verification", resendVerificationEmail);

router.post("/google-login", googleLogin);

router.post("/createDecisionRoom", createDecisionRoom);

router.get("/userFetcher", userFetcher);

// exporting all the routers here
export default router;
