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

// Helper to auto-generate provider intro
function generateProviderIntro({
  companyName,
  services,
  location,
  yearEstablished,
  totalWorkers,
  availability,
  paymentMethods,
}) {
  const isSolo = totalWorkers === 1;
  const servicesFormatted = Array.isArray(services)
    ? services.join(", ")
    : services;
  const paymentFormatted = Array.isArray(paymentMethods)
    ? paymentMethods.join(", ")
    : paymentMethods;
  const establishedText = yearEstablished
    ? `, operating since ${yearEstablished}`
    : "";
  const availabilityText =
    availability && availability.length > 0
      ? ` ${isSolo ? "I'm" : "We're"} available ${
          Array.isArray(availability) ? availability.join(", ") : availability
        }.`
      : "";

  if (isSolo) {
    return `Hello! ${companyName} here — I provide ${servicesFormatted} services in ${location}${establishedText}.${availabilityText} Payments accepted: ${paymentFormatted}.`;
  } else {
    return `Hello! ${companyName} here — We provide ${servicesFormatted} services in ${location} with a team of ${totalWorkers} professionals${establishedText}.${availabilityText} Payments accepted: ${paymentFormatted}.`;
  }
}

// User Signup (Personal User)
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phone, location } = req.body;

    const emailLower = email.toLowerCase();
    const locationLower = location.toLowerCase();
    const existing = await User.findOne({
      $or: [
        { "userProfile.email": emailLower },
        { "providerProfile.phone": phone },
      ],
    });

    const passwordHash = await bcrypt.hash(password, 12);

    if (existing?.email && !existing.providerProfile) {
      return res.status(400).json({ message: "Email already registered." });
    }

    if (existing?.providerProfile?.phone) {
      existing.accountType = "both";
      existing.userProfile = {
        fullName,
        email: emailLower,
        passwordHash,
        phone,
        location: locationLower,
        profilePhoto: "", //setURL of bucket default photo
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
      userProfile: {
        fullName,
        email: emailLower,
        passwordHash,
        phone,
        location: locationLower,
        profilePhoto: "", //setURL of bucket default photo
      },
    });

    const savedUser = await newUser.save();
    const token = generateAccessToken(savedUser._id);
    const refreshToken = generateRefreshToken(savedUser._id);
    await storeRefreshToken(savedUser._id.toString(), refreshToken);
    setAuthCookie(res, token, refreshToken);

    return res.status(201).json({ token, message: "Registration successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const registerProvider = asyncHandler(async (req, res) => {
  const {
    companyName,
    phone,
    services,
    password,
    email,
    location,
    intro = "",
    availability = [],
    yearEstablished,
    paymentMethods = [],
    serviceAreas = [],
    customFields = [],
  } = req.body;

  if (!companyName || !phone || !password || !services || !location) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const providerEmail = email?.toLowerCase();
  const locationLower = location.toLowerCase();
  const existingByEmail = providerEmail
    ? await User.findOne({ email: providerEmail })
    : null;
  const existingByPhone = await User.findOne({ "userProfile.phone": phone });

  const existing = existingByEmail || existingByPhone;
  const passwordHash = await bcrypt.hash(password, 12);

  // Convert array of customFields (e.g., [{ key: 'certification', value: 'ISO' }]) into an object
  const otherSpecifics = {};
  if (Array.isArray(customFields)) {
    for (const { key, value } of customFields) {
      if (key && value) {
        otherSpecifics[key] = value;
      }
    }
  }

  const totalWorkers = req.body.totalWorkers || 1;
  const baseProviderProfile = {
    companyName,
    phone,
    providerPass: passwordHash,
    providerEmail: providerEmail || null,
    profilePhoto: "",
    location: locationLower,
    // Auto-generate intro
    intro: generateProviderIntro({
      companyName,
      services,
      location: locationLower,
      yearEstablished,
      totalWorkers,
      availability,
      paymentMethods,
    }),
    totalReviews: 0,
    overallRating: 0,
    avgReviewRating: 0,
    avgResponseTime: 0,
    avgRequestAcceptanceRate: 0,
    availability:
      Array.isArray(availability) && availability.length > 0
        ? availability
        : ["Mon", "Tue", "Wed", "Thu", "Fri"],

    projectsDone: 0,
    yearOfEstablishment: Number(yearEstablished) || new Date().getFullYear(),

    paymentMethods:
      Array.isArray(paymentMethods) && paymentMethods.length > 0
        ? paymentMethods
        : ["Cash", "UPI"],

    services: Array.isArray(services) ? services : [services],
    serviceAreas:
      Array.isArray(serviceAreas) && serviceAreas.length > 0
        ? serviceAreas
        : ["Amritsar"],

    totalWorkers,
    gallery: [],
    awards: [],
    verification: {
      status: "pending",
    },
    ...(Object.keys(otherSpecifics).length > 0 && {
      otherSpecifics,
    }),
  };

  if (existing) {
    existing.accountType = "both";
    if (providerEmail) existing.email = providerEmail;
    existing.providerProfile = baseProviderProfile;

    await existing.save();

    const token = generateAccessToken(existing._id);
    const refreshToken = generateRefreshToken(existing._id);
    await storeRefreshToken(existing._id.toString(), refreshToken);
    setAuthCookie(res, token, refreshToken);

    return res.status(200).json({ token, message: "Upgraded to both" });
  }

  const user = await User.create({
    accountType: "provider",
    email: providerEmail,
    providerProfile: baseProviderProfile,
  });

  const token = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  await storeRefreshToken(user._id.toString(), refreshToken);
  setAuthCookie(res, token, refreshToken);

  return res.status(201).json({
    token,
    message: "Provider registration successful",
  });
});

// Login with Email (User)
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ "userProfile.email": email });
  if (!user || user.accountType === "provider") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.userProfile.passwordHash);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  await storeRefreshToken(user._id.toString(), refreshToken);
  setAuthCookie(res, token, refreshToken);
  const userObj = user.toObject();
  delete userObj.userProfile.passwordHash;
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
  // console.log(`[OTP/Reset] Token: ${token}`);

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
  // console.log(`[OTP] ${otp} sent to ${phone}`);

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
