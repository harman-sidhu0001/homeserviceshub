import User from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../utils/asyncHandler.js";
import { generateAccessToken } from "../services/tokenService.js";

// @desc    Admin login
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.accountType !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateAccessToken(user._id);
  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      accountType: user.accountType,
    },
  });
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
