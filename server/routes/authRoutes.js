import express from "express";
import {
  registerUser,
  registerProvider,
  loginUser,
  loginProvider,
  forgotPassword,
  resetPassword,
  sendOTP,
  confirmOTP,
  authStatus,
  logout,
  refreshAccessToken,
} from "../controllers/authController.js";
import { rateLimitPerUser } from "../middleware/rateLimiter.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Auth Routes
router.post("/register/user", registerUser);
router.post("/register/provider", registerProvider);
router.post("/login/user", loginUser);
router.post("/login/provider", loginProvider);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/status", authenticate, authStatus);
router.post("/refresh", refreshAccessToken);
router.post(
  "/send-otp",
  rateLimitPerUser("otp-req", 3, 600), // 3 requests / 10 min
  sendOTP
);

router.post(
  "/confirm-otp",
  rateLimitPerUser("otp-confirm", 5, 300), // 5 retries / 5 min
  confirmOTP
);

export default router;
