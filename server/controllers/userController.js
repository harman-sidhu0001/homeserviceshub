import User from "../models/User.js";
import ServiceRequest from "../models/ServiceRequest.js";
import asyncHandler from "../utils/asyncHandler.js";
import { findNearbyProviders } from "../services/locationService.js";
import {
  uploadProfilePhoto as profilePhotoConfig,
  uploadVerificationDocs as verificationDocsConfig,
} from "../config/s3Config.js";
import {
  handleSingleFileUpload,
  handleMultipleFilesUpload,
} from "../utils/uploadHandler.js";
import { sendGmailNotification } from "../services/emailNotificationService.js";

// @desc    Get logged-in user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json({ success: true, user });
});

// @desc    Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, phone, location, profilePhoto } = req.body;

  const updatedFields = {};
  if (fullName) updatedFields["userProfile.fullName"] = fullName;
  if (phone) updatedFields["userProfile.phone"] = phone;
  if (location) updatedFields["userProfile.location"] = location;
  if (profilePhoto) updatedFields["userProfile.profilePhoto"] = profilePhoto;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updatedFields },
    { new: true }
  );

  res.status(200).json({ success: true, user: updatedUser });
});

// @desc    Upload user profile photo
export const uploadProfilePhoto = handleSingleFileUpload(
  profilePhotoConfig,
  "userProfile.profilePhoto",
  "userProfile.profilePhoto",
  "file"
);

// @desc    Upload verification documents
export const uploadVerificationDocuments = handleMultipleFilesUpload(
  verificationDocsConfig,
  "providerProfile.verification",
  (files) => {
    const verificationData = {
      status: "requested",
      idProof: {},
    };

    if (files["aadhaarFront"] && files["aadhaarFront"][0]) {
      verificationData.idProof.aadhaarFront = {
        documentName: files["aadhaarFront"][0].originalname,
        documentUrl: files["aadhaarFront"][0].location,
      };
    }

    if (files["aadhaarBack"] && files["aadhaarBack"][0]) {
      verificationData.idProof.aadhaarBack = {
        documentName: files["aadhaarBack"][0].originalname,
        documentUrl: files["aadhaarBack"][0].location,
      };
    }

    if (files["panCard"] && files["panCard"][0]) {
      verificationData.idProof.panCard = {
        documentName: files["panCard"][0].originalname,
        documentUrl: files["panCard"][0].location,
      };
    }

    return verificationData;
  },
  [
    { name: "aadhaarFront", maxCount: 1 },
    { name: "aadhaarBack", maxCount: 1 },
    { name: "panCard", maxCount: 1 },
  ]
);

// @desc    Get comprehensive user profile with service history
export const getUserProfileDetailed = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get user with profile
  const user = await User.findById(userId)
    .select("userProfile accountType")
    .lean();

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  // Get user's service requests
  const serviceRequests = await ServiceRequest.find({ userId })
    .populate(
      "providerId",
      "providerProfile.companyName providerProfile.location providerProfile.profilePhoto"
    )
    .sort({ createdAt: -1 })
    .lean();

  // Calculate user stats
  const totalRequests = serviceRequests.length;
  const completedRequests = serviceRequests.filter(
    (r) => r.status === "accepted"
  ).length;
  const pendingRequests = serviceRequests.filter(
    (r) => r.status === "pending"
  ).length;
  const cancelledRequests = serviceRequests.filter(
    (r) => r.status === "cancelled"
  ).length;

  // Get user's bookmarks (favorite providers)
  const bookmarks = await User.find({
    _id: { $in: user.userProfile.bookmarks || [] },
    accountType: { $in: ["provider", "both"] },
  })
    .select(
      "providerProfile.companyName providerProfile.location providerProfile.profilePhoto providerProfile.services"
    )
    .lean();

  const enhancedUser = {
    ...user,
    userProfile: {
      ...user.userProfile,
      totalRequests,
      completedRequests,
      pendingRequests,
      cancelledRequests,
      serviceHistory: serviceRequests,
      bookmarks,
    },
  };

  res.status(200).json({
    success: true,
    data: enhancedUser.userProfile,
  });
});

// @desc    Get user service history
export const getUserServiceHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { status, page = 1, limit = 10 } = req.query;

  const query = { userId };
  if (status) query.status = status;

  const skip = (page - 1) * limit;

  const requests = await ServiceRequest.find(query)
    .populate(
      "providerId",
      "providerProfile.companyName providerProfile.location providerProfile.phone"
    )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  const total = await ServiceRequest.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      requests,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRequests: total,
        hasNext: skip + requests.length < total,
        hasPrev: page > 1,
      },
    },
  });
});

// @desc    Add provider to bookmarks
export const addToBookmarks = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { providerId } = req.body;

  if (!providerId.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error("Invalid provider ID format.");
  }

  // Verify provider exists
  const provider = await User.findById(providerId);
  if (!provider || !["provider", "both"].includes(provider.accountType)) {
    res.status(404);
    throw new Error("Provider not found.");
  }

  // Add to bookmarks if not already bookmarked
  const user = await User.findById(userId);
  const bookmarks = user.userProfile.bookmarks || [];

  if (!bookmarks.includes(providerId)) {
    await User.findByIdAndUpdate(userId, {
      $push: { "userProfile.bookmarks": providerId },
    });
  }

  res.status(200).json({
    success: true,
    message: "Provider added to bookmarks",
  });
});

// @desc    Remove provider from bookmarks
export const removeFromBookmarks = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { providerId } = req.params;

  if (!providerId.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error("Invalid provider ID format.");
  }

  await User.findByIdAndUpdate(userId, {
    $pull: { "userProfile.bookmarks": providerId },
  });

  res.status(200).json({
    success: true,
    message: "Provider removed from bookmarks",
  });
});

// @desc    Get user bookmarks
export const getUserBookmarks = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId)
    .select("userProfile.bookmarks")
    .lean();
  const bookmarks = user.userProfile.bookmarks || [];

  if (bookmarks.length === 0) {
    return res.status(200).json({
      success: true,
      data: [],
    });
  }

  const bookmarkedProviders = await User.find({
    _id: { $in: bookmarks },
    accountType: { $in: ["provider", "both"] },
  })
    .select(
      "providerProfile.companyName providerProfile.location providerProfile.profilePhoto providerProfile.services providerProfile.overallRating providerProfile.totalReviews"
    )
    .lean();

  res.status(200).json({
    success: true,
    data: bookmarkedProviders,
  });
});

// @desc    Get providers near a given location
export const listNearbyProviders = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Latitude and longitude required" });
  }

  const providers = await findNearbyProviders([
    parseFloat(longitude),
    parseFloat(latitude),
  ]);
  res.status(200).json({ success: true, providers });
});

// @desc    Request a service from a provider
export const requestService = asyncHandler(async (req, res) => {
  const {
    providerId,
    serviceName,
    description,
    preferredDate,
    location,
    budget,
  } = req.body;

  if (!providerId || !serviceName || !preferredDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!providerId.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error("Invalid provider ID format.");
  }

  const provider = await User.findById(providerId);
  if (!provider || !["provider", "both"].includes(provider.accountType)) {
    return res.status(404).json({ message: "Service provider not found" });
  }

  const serviceRequest = await ServiceRequest.create({
    userId: req.user._id,
    providerId,
    serviceName,
    description,
    preferredDate: new Date(preferredDate),
    location,
    budget,
    status: "pending",
  });

  res.status(201).json({ success: true, request: serviceRequest });
});

// @desc    Cancel service request (user-side)
export const cancelServiceRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  const request = await ServiceRequest.findOne({
    _id: requestId,
    userId: req.user._id,
  });

  if (!request) {
    return res.status(404).json({ message: "Service request not found" });
  }

  if (request.status !== "pending") {
    return res
      .status(400)
      .json({ message: "Only pending requests can be cancelled" });
  }

  request.status = "cancelled";
  await request.save();

  res
    .status(200)
    .json({ success: true, message: "Request cancelled successfully" });
});

// @desc    Rate and review a completed service
export const rateService = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { rating, review, serviceQuality, professionalism, valueForMoney } =
    req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Valid rating (1-5) is required" });
  }

  const request = await ServiceRequest.findOne({
    _id: requestId,
    userId: req.user._id,
    status: "accepted",
  });

  if (!request) {
    return res
      .status(404)
      .json({ message: "Completed service request not found" });
  }

  // Add review to the request
  request.review = {
    rating,
    review,
    serviceQuality,
    professionalism,
    valueForMoney,
    reviewedAt: new Date(),
  };
  await request.save();

  // Update provider's overall rating
  const providerReviews = await ServiceRequest.find({
    providerId: request.providerId,
    "review.rating": { $exists: true },
  });

  const totalRating = providerReviews.reduce(
    (sum, req) => sum + req.review.rating,
    0
  );
  const averageRating = totalRating / providerReviews.length;

  await User.findByIdAndUpdate(request.providerId, {
    $set: {
      "providerProfile.overallRating": averageRating,
      "providerProfile.totalReviews": providerReviews.length,
    },
  });

  res.status(200).json({
    success: true,
    message: "Review submitted successfully",
  });
});

// @desc    Get user analytics
export const getUserAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { period = "30" } = req.query; // days

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(period));

  // Get user's requests in the specified period
  const requests = await ServiceRequest.find({
    userId,
    createdAt: { $gte: startDate },
  }).lean();

  // Calculate analytics
  const analytics = {
    totalRequests: requests.length,
    completedRequests: requests.filter((r) => r.status === "accepted").length,
    cancelledRequests: requests.filter((r) => r.status === "cancelled").length,
    pendingRequests: requests.filter((r) => r.status === "pending").length,
    averageRating:
      requests.filter((r) => r.review?.rating).length > 0
        ? (
            requests
              .filter((r) => r.review?.rating)
              .reduce((sum, r) => sum + r.review.rating, 0) /
            requests.filter((r) => r.review?.rating).length
          ).toFixed(1)
        : 0,
    totalSpent: requests
      .filter((r) => r.status === "accepted" && r.budget)
      .reduce((sum, r) => sum + r.budget, 0),
    favoriteServices: [], // Would be calculated from service requests
    monthlyTrend: [], // Would be calculated for chart display
  };

  res.status(200).json({
    success: true,
    data: analytics,
  });
});

// Example: Notify user on booking (add this in the relevant booking controller)
export const notifyUserOnBooking = asyncHandler(async (req, res) => {
  const { userEmail, serviceName } = req.body;
  await sendGmailNotification({
    to: userEmail,
    subject: `Booking Confirmed for ${serviceName}`,
    text: `Your booking for ${serviceName} is confirmed!`,
    html: `<p>Your booking for <b>${serviceName}</b> is confirmed!</p>`,
  });
  res.json({ success: true, message: "Notification sent" });
});
