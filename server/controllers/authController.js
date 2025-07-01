import User from "../models/User.js";
import bcrypt from "bcryptjs";
import {
  deleteRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  storeRefreshToken,
  verifyRefreshToken,
} from "../services/tokenService.js";
import { generateOTP, storeOTP } from "../services/otpServices.js";
import { verifyOTP } from "../services/otpServices.js";
import { generateSecureToken } from "../utils/tokenUtils.js";
import redis from "../config/redisClient.js";
import asyncHandler from "../utils/asyncHandler.js";
import setAuthCookie from "../services/cookieService.js";
import { REFRESH_TOKEN_SECRET } from "../config/jwt.js";

// User Signup (Personal User)
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phone, location } = req.body;

    const emailLower = email.toLowerCase();
    const locationLower = location.toLowerCase();
    const existing = await User.findOne({
      $or: [{ email: emailLower }, { "providerProfile.phone": phone }],
    });

    const passwordHash = await bcrypt.hash(password, 12);

    if (existing?.email && !existing.providerProfile) {
      return res.status(400).json({ message: "Email already registered." });
    }

    if (existing?.providerProfile?.phone) {
      existing.accountType = "both";
      existing.email = emailLower;
      existing.passwordHash = passwordHash;
      existing.userProfile = {
        fullName,
        phone,
        location: locationLower,
      };

      // 🔒 Keep providerProfile untouched
      await existing.save();

      const token = generateAccessToken(existing._id);
      const refreshToken = generateRefreshToken(existing._id);
      await storeRefreshToken(existing._id.toString(), refreshToken);
      setAuthCookie(res, token, refreshToken);
      return res.status(200).json({ token, message: "Upgraded to both" });
    }

    // ✅ Use constructor + .save()
    const newUser = new User({
      accountType: "user",
      email: emailLower,
      passwordHash,
      userProfile: {
        fullName,
        phone,
        location: locationLower,
      },
    });

    const savedUser = await newUser.save();
    const token = generateAccessToken(savedUser._id);
    const refreshToken = generateRefreshToken(savedUser._id);
    await storeRefreshToken(savedUser._id.toString(), refreshToken);
    setAuthCookie(res, token, refreshToken);

    return res.status(201).json({ token, message: "Registration successful" });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Provider Signup (Business Account)
export const registerProvider = async (req, res) => {
  const { companyName, phone, services, password, location, email } = req.body;

  if (!companyName || !phone || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const emailLower = email?.toLowerCase();

  // Look for user by either email or phone in userProfile
  const existingUser = await User.findOne({
    $or: [
      emailLower ? { email: emailLower } : null,
      { "userProfile.phone": phone },
      { "providerProfile.phone": phone },
    ].filter(Boolean), // removes null if email isn't passed
  });

  // If user exists AND has a providerProfile, reject
  if (existingUser && existingUser.providerProfile) {
    return res.status(400).json({ message: "Provider already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  if (existingUser && !existingUser.providerProfile) {
    // User exists but does NOT have providerProfile → upgrade
    existingUser.accountType =
      existingUser.accountType === "user" ? "both" : existingUser.accountType;

    if (emailLower) existingUser.email = emailLower;

    existingUser.providerProfile = {
      companyName,
      phone,
      services,
      location,
      providerPass: passwordHash,
    };

    await existingUser.save();

    const token = generateAccessToken(existingUser._id);
    return res
      .status(200)
      .json({ token, message: "User upgraded to provider." });
  }

  // No user exists → Create new provider
  const newUser = await User.create({
    accountType: "provider",
    email: emailLower,
    providerProfile: {
      companyName,
      phone,
      services,
      location,
      providerPass: passwordHash,
    },
  });

  const token = generateAccessToken(newUser._id);
  return res.status(201).json({ token });
};

// Login with Email (User)
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.accountType === "provider") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  await storeRefreshToken(user._id.toString(), refreshToken);
  setAuthCookie(res, token, refreshToken);
  const userObj = user.toObject();
  delete userObj.passwordHash;
  res.status(200).json({ message: "Login Successfull", user: userObj });
};

// Login with Company Phone (Provider)
export const loginProvider = async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ "providerProfile.phone": phone });
  if (!user || user.accountType === "user") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(
    password,
    user.providerProfile.providerPass
  );
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  await storeRefreshToken(user._id.toString(), refreshToken);
  setAuthCookie(res, token, refreshToken);

  const userObj = user.toObject();
  delete userObj.passwordHash;
  res.status(200).json({ message: "Login Successful", user: userObj });
};

//logout
export const logout = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (userId) await deleteRefreshToken(userId); // Redis
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out" });
});

// @desc    Forgot password (generate token)
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email, phone } = req.body;

  const user = await User.findOne(
    email ? { email } : { "providerProfile.phone": phone }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = generateSecureToken(); // from utils
  const tokenExpiry = Date.now() + 10 * 60 * 1000; // 10 mins

  user.resetToken = token;
  user.resetTokenExpiry = tokenExpiry;
  await user.save();

  // Simulate send
  console.log(`[OTP/Reset] Token: ${token}`);

  res.status(200).json({ success: true, message: "Reset token generated" });
});

// @desc    Reset password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  user.passwordHash = hashed;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.status(200).json({ success: true, message: "Password reset successful" });
});

export const sendOTP = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  const user = await User.findOne({ "providerProfile.phone": phone });
  if (!user) throw new Error("User not found");

  const userId = user._id.toString();
  const otpReqKey = `otp-req:${userId}`;

  // 🔒 Rate limit check
  const reqCount = await redis.incr(otpReqKey);
  if (reqCount === 1) {
    await redis.expire(otpReqKey, 600); // Start 10-min window on first request
  }

  if (reqCount > 3) {
    return res
      .status(429)
      .json({ message: "Too many OTP requests. Try again later." });
  }

  const otp = generateOTP();
  await storeOTP(userId, otp);

  // Simulate SMS send
  console.log(`[OTP] ${otp} sent to ${phone}`);

  res.status(200).json({ success: true, message: "OTP sent" });
});

export const confirmOTP = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  await verifyOTP(userId, otp);

  res.status(200).json({ success: true, message: "OTP verified" });
});

export const authStatus = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// controller
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "Missing refresh token" });

  const { valid, payload, error } = verifyRefreshToken(refreshToken);
  if (!valid) return res.status(403).json({ message: "Invalid refresh token" });

  const user = await User.findById(payload.id).select("-passwordHash");
  if (!user) return res.status(401).json({ message: "User not found" });

  const accessToken = generateAccessToken(user._id);
  setAuthCookie(res, accessToken, refreshToken); // Refresh only access token

  return res.status(200).json({ message: "Access token refreshed", user });
});
