import User from "../models/User.js";
import ServiceRequest from "../models/ServiceRequest.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../utils/asyncHandler.js";
import {
  generateAccessToken,
  generateRefreshToken,
  storeRefreshToken,
} from "../services/tokenService.js";
import setAuthCookie from "../services/cookieService.js";

// @desc    Admin login
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  console.log("Admin login attempt:", { email, password });
  console.log("User found:", user ? user : "No user found");
  if (!user || user.accountType !== "admin") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  await storeRefreshToken(user._id.toString(), refreshToken);
  setAuthCookie(res, token, refreshToken);

  const userObj = user.toObject();
  delete userObj.passwordHash;
  res.status(200).json({ message: "Login Successful", user: userObj });
});

// View all users (excluding admins)
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({
    accountType: { $in: ["user", "both"] },
  }).select("-passwordHash");

  res.status(200).json({ success: true, users });
});

// View all providers
export const getAllProviders = asyncHandler(async (req, res) => {
  const providers = await User.find({
    accountType: { $in: ["provider", "both"] },
  }).select("-passwordHash");

  res.status(200).json({ success: true, providers });
});

// View all service requests
export const getAllServiceRequests = asyncHandler(async (req, res) => {
  const requests = await ServiceRequest.find({})
    .populate("userId", "email userProfile")
    .populate("providerId", "providerProfile companyName");

  res.status(200).json({ success: true, requests });
});

// Deactivate (soft-delete) user or provider
export const deactivateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ success: true, message: "User deactivated", user });
});

// Activate (reactivate) user by admin
export const activateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: true },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ success: true, message: "User activated", user });
});
export const activateProvider = asyncHandler(async (req, res) => {
  const { providerId } = req.params;

  const provider = await User.findByIdAndUpdate(
    providerId,
    { isActive: true },
    { new: true }
  );

  if (!provider) {
    return res.status(404).json({ message: "Provider not found" });
  }

  res
    .status(200)
    .json({ success: true, message: "Provider activated", provider });
});

// Update user by admin
export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const update = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  // Redundant update for robustness
  if (update.fullName) {
    user.userProfile.fullName = update.fullName;
  }
  if (update.email) {
    user.email = update.email;
    user.userProfile.email = update.email;
  }
  if (update.phone) {
    user.phone = update.phone;
    user.userProfile.phone = update.phone;
  }
  if (update.location) {
    user.userProfile.location = update.location;
  }
  if (update.profilePhoto) {
    user.userProfile.profilePhoto = update.profilePhoto;
  }
  if (update.password) {
    const hashed = await bcrypt.hash(update.password, 10);
    user.passwordHash = hashed;
    user.userProfile.passwordHash = hashed;
  }
  await user.save();
  res.status(200).json({ success: true, message: "User updated", user });
});

// Delete user by admin
export const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ success: true, message: "User deleted" });
});

export const getPlatformStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({
    accountType: { $in: ["user", "both"] },
  });
  const totalProviders = await User.countDocuments({
    accountType: { $in: ["provider", "both"] },
  });
  const totalAdmins = await User.countDocuments({ accountType: "admin" });

  const totalRequests = await ServiceRequest.countDocuments();
  const pendingRequests = await ServiceRequest.countDocuments({
    status: "pending",
  });
  const acceptedRequests = await ServiceRequest.countDocuments({
    status: "accepted",
  });
  const rejectedRequests = await ServiceRequest.countDocuments({
    status: "rejected",
  });

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalProviders,
      totalAdmins,
      totalRequests,
      requestBreakdown: {
        pending: pendingRequests,
        accepted: acceptedRequests,
        rejected: rejectedRequests,
      },
    },
  });
});
export const getTopCities = asyncHandler(async (req, res) => {
  const topCities = await ServiceRequest.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    {
      $group: {
        _id: "$userInfo.userProfile.location.city",
        totalRequests: { $sum: 1 },
      },
    },
    { $sort: { totalRequests: -1 } },
    { $limit: 5 },
  ]);

  res.status(200).json({ success: true, topCities });
});
export const getWeeklyRequestTrend = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const trend = await ServiceRequest.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({ success: true, trend });
});

// Update provider by admin
export const updateProviderByAdmin = asyncHandler(async (req, res) => {
  const { providerId } = req.params;
  const update = req.body;
  const user = await User.findById(providerId);
  if (!user) {
    return res.status(404).json({ message: "Provider not found" });
  }
  // Robust update for all registration fields
  const p = user.providerProfile || {};
  if (update.companyName) p.companyName = update.companyName;
  if (update.providerEmail) {
    user.email = update.providerEmail;
    p.providerEmail = update.providerEmail;
  }
  if (update.phone) {
    user.phone = update.phone;
    p.phone = update.phone;
  }
  if (update.location) p.location = update.location;
  if (update.profilePhoto) p.profilePhoto = update.profilePhoto;
  if (update.intro) p.intro = update.intro;
  if (update.totalReviews !== undefined) p.totalReviews = update.totalReviews;
  if (update.overallRating !== undefined)
    p.overallRating = update.overallRating;
  if (update.avgReviewRating !== undefined)
    p.avgReviewRating = update.avgReviewRating;
  if (update.avgResponseTime !== undefined)
    p.avgResponseTime = update.avgResponseTime;
  if (update.avgRequestAcceptanceRate !== undefined)
    p.avgRequestAcceptanceRate = update.avgRequestAcceptanceRate;
  if (update.projectsDone !== undefined) p.projectsDone = update.projectsDone;
  if (update.projectsOngoing !== undefined)
    p.projectsOngoing = update.projectsOngoing;
  if (update.yearOfEstablishment !== undefined)
    p.yearOfEstablishment = update.yearOfEstablishment;
  if (update.subscriptionPlan) p.subscriptionPlan = update.subscriptionPlan;
  if (update.paymentMethods) p.paymentMethods = update.paymentMethods;
  if (update.services) p.services = update.services;
  if (update.serviceAreas) p.serviceAreas = update.serviceAreas;
  if (update.totalWorkers !== undefined) p.totalWorkers = update.totalWorkers;
  if (update.gallery) p.gallery = update.gallery;
  if (update.awards) p.awards = update.awards;
  // Password
  if (update.password) {
    const hashed = await bcrypt.hash(update.password, 10);
    user.passwordHash = hashed;
    p.providerPass = hashed;
  }
  user.providerProfile = p;
  await user.save();
  res.status(200).json({ success: true, message: "Provider updated", user });
});

// Delete provider by admin
export const deleteProviderByAdmin = asyncHandler(async (req, res) => {
  const { providerId } = req.params;
  const user = await User.findByIdAndDelete(providerId);
  if (!user) {
    return res.status(404).json({ message: "Provider not found" });
  }
  res.status(200).json({ success: true, message: "Provider deleted" });
});
