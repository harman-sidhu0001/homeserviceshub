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

// @desc    Get all verification requests
export const getAllVerificationRequests = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const query = {
    accountType: { $in: ["provider", "both"] },
    "providerProfile.verification.status": { $exists: true },
  };

  // If status is specified, filter by that status, otherwise get all verification requests
  if (status) {
    query["providerProfile.verification.status"] = status;
  }
  // If no status specified, get all verification requests (requested, verified, rejected)

  const skip = (page - 1) * limit;

  const providers = await User.find(query)
    .select(
      "providerProfile.companyName providerProfile.verification providerProfile.profilePhoto createdAt providerProfile.phone"
    )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      providers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProviders: total,
        hasNext: skip + providers.length < total,
        hasPrev: page > 1,
      },
    },
  });
});

// @desc    Update provider verification status
export const updateProviderVerificationStatus = asyncHandler(
  async (req, res) => {
    const { providerId } = req.params;
    const { status, adminNotes } = req.body;

    if (!["pending", "requested", "verified", "rejected"].includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status. Must be 'pending', 'requested', 'verified', or 'rejected'",
      });
    }

    const provider = await User.findById(providerId);
    if (!provider || !["provider", "both"].includes(provider.accountType)) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Initialize verification object if it doesn't exist
    if (!provider.providerProfile.verification) {
      provider.providerProfile.verification = {};
    }

    const currentStatus = provider.providerProfile.verification.status;

    // Validate status transitions
    if (currentStatus === "verified" && status !== "verified") {
      return res.status(400).json({
        message: "Cannot change status of already verified provider",
      });
    }

    // Only allow admin to change from 'requested' to 'verified' or 'rejected'
    if (
      currentStatus === "requested" &&
      !["verified", "rejected"].includes(status)
    ) {
      return res.status(400).json({
        message: "Can only approve or reject verification requests",
      });
    }

    // Update verification status
    provider.providerProfile.verification.status = status;

    // Add admin notes if provided
    if (adminNotes) {
      provider.providerProfile.verification.adminNotes = adminNotes;
    }

    // Add timestamp for when status was updated
    provider.providerProfile.verification.statusUpdatedAt = new Date();

    await provider.save();

    res.status(200).json({
      success: true,
      message: `Provider verification status updated to ${status}`,
      data: {
        providerId: provider._id,
        companyName: provider.providerProfile.companyName,
        verificationStatus: provider.providerProfile.verification.status,
        adminNotes: provider.providerProfile.verification.adminNotes,
        statusUpdatedAt: provider.providerProfile.verification.statusUpdatedAt,
      },
    });
  }
);

// @desc    Get verification statistics
export const getVerificationStats = asyncHandler(async (req, res) => {
  const stats = await User.aggregate([
    {
      $match: {
        accountType: { $in: ["provider", "both"] },
        "providerProfile.verification.status": { $exists: true },
      },
    },
    {
      $group: {
        _id: "$providerProfile.verification.status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Convert to object format
  const verificationStats = {
    pending: 0,
    requested: 0,
    verified: 0,
    rejected: 0,
    total: 0,
  };

  stats.forEach((stat) => {
    verificationStats[stat._id] = stat.count;
    verificationStats.total += stat.count;
  });

  res.status(200).json({
    success: true,
    data: verificationStats,
  });
});

// @desc    Verify provider with document uploads (aadhaar front/back, pan card, gst, admin notes)
export const verifyProviderWithDocs = asyncHandler(async (req, res) => {
  const { providerId } = req.params;
  const { gstNumber, adminNotes } = req.body;
  const files = req.files || {};

  // Validate required files
  if (!files.aadhaarFront || !files.aadhaarBack || !files.panCard) {
    return res.status(400).json({
      message:
        "Aadhaar front, Aadhaar back, and PAN card documents are required.",
    });
  }

  const provider = await User.findById(providerId);
  if (!provider || !["provider", "both"].includes(provider.accountType)) {
    return res.status(404).json({ message: "Provider not found" });
  }

  // Initialize verification object if it doesn't exist
  if (!provider.providerProfile.verification) {
    provider.providerProfile.verification = {};
  }
  if (!provider.providerProfile.verification.idProof) {
    provider.providerProfile.verification.idProof = {};
  }

  // Save document info
  provider.providerProfile.verification.idProof.aadhaarFront = {
    documentName: files.aadhaarFront[0].originalname,
    documentUrl:
      files.aadhaarFront[0].location ||
      files.aadhaarFront[0].url ||
      files.aadhaarFront[0].path,
  };
  provider.providerProfile.verification.idProof.aadhaarBack = {
    documentName: files.aadhaarBack[0].originalname,
    documentUrl:
      files.aadhaarBack[0].location ||
      files.aadhaarBack[0].url ||
      files.aadhaarBack[0].path,
  };
  provider.providerProfile.verification.idProof.panCard = {
    documentName: files.panCard[0].originalname,
    documentUrl:
      files.panCard[0].location ||
      files.panCard[0].url ||
      files.panCard[0].path,
  };

  // Save GST number if provided
  if (gstNumber) {
    provider.providerProfile.verification.idProof.gstNumber = gstNumber;
  }

  // Save admin notes
  if (adminNotes) {
    provider.providerProfile.verification.adminNotes = adminNotes;
  }

  // Set verification status and timestamp
  provider.providerProfile.verification.status = "verified";
  provider.providerProfile.verification.statusUpdatedAt = new Date();

  await provider.save();

  res.status(200).json({
    success: true,
    message: "Provider verified and documents uploaded successfully.",
    provider: {
      _id: provider._id,
      companyName: provider.providerProfile.companyName,
      verification: provider.providerProfile.verification,
    },
  });
});
