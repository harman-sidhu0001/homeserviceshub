import User from "../models/User.js";
import Services from "../models/Services.js";
import ServiceRequest from "../models/ServiceRequest.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  uploadProviderPhoto as providerPhotoConfig,
  uploadGalleryImage as galleryUploadConfig,
} from "../config/s3Config.js";
import {
  handleSingleFileUpload,
  handleGalleryUpload,
  deleteS3Object,
} from "../utils/uploadHandler.js";
import Review from "../models/Review.js";
import { calculateOverallRating } from "../utils/ratingCalculator.js";
import { calculateResponseTimeStars, updateRunningAverage } from "../utils/responseTimeCalculator.js";
import ChangeRequest from "../models/ChangeRequest.js";
import { sendCustomerServiceRequestStatusEmail, sendUserRegistrationOtpEmail, sendCompletionOtpEmail } from "../services/emailService.js";
import { generateOTP } from "../services/otpServices.js";
import redis from "../config/redisClient.js";

export const getServiceProviders = asyncHandler(async (req, res) => {
  let { service, city = "amritsar", sortBy = "reviews" } = req.query;

  if (!service) {
    return res.status(400).json({ message: "Service or query is required" });
  }

  const searchTerm = service.trim().toLowerCase();

  // 🔍 Step 1: Find service names related to the search term
  const matchedServices = await Services.find({
    $or: [
      { name: { $regex: new RegExp(`^${searchTerm}$`, "i") } },
      { similarWords: { $regex: new RegExp(searchTerm, "i") } },
    ],
  }).select("name");

  const matchedServiceNames = matchedServices.map((s) => s.name);
  // 🔠 Normalize all to lowercase for case-insensitive match
  const allServiceTerms = [
    ...new Set([searchTerm, ...matchedServiceNames]),
  ].map((s) => s.toLowerCase());

  // 🔧 Step 2: Build sort options
  let sortOptions = {};
  switch (sortBy) {
    case "rating":
      sortOptions = { "providerProfile.overallRating": -1 };
      break;
    case "projects":
      sortOptions = { "providerProfile.projectsDone": -1 };
      break;
    default:
      sortOptions = { "providerProfile.totalReviews": -1 };
      break;
  }

  // 🧠 Step 3: Build aggregation pipeline
  const pipeline = [
    {
      $match: {
        accountType: { $in: ["provider", "both"] },
        "providerProfile.location": { $regex: city, $options: "i" },
        $or: [
          { "providerProfile.services": { $exists: true, $ne: [] } },
          {
            "providerProfile.companyName": {
              $regex: new RegExp(searchTerm, "i"),
            },
          },
        ],
      },
    },
    {
      $project: {
        providerProfile: 1,
        email: 1,
        matchedByService: {
          $gt: [
            {
              $size: {
                $setIntersection: [
                  {
                    $map: {
                      input: "$providerProfile.services",
                      as: "s",
                      in: { $toLower: "$$s" },
                    },
                  },
                  allServiceTerms,
                ],
              },
            },
            0,
          ],
        },
        matchedByCompany: {
          $regexMatch: {
            input: "$providerProfile.companyName",
            regex: new RegExp(searchTerm, "i"),
          },
        },
      },
    },
    {
      $sort: sortOptions,
    },
  ];

  const providers = await User.aggregate(pipeline);

  const data1 = providers.filter((p) => p.matchedByService);
  const data2 = providers.filter((p) => p.matchedByCompany);

  return res.status(200).json({
    success: true,
    data1,
    data2,
  });
});

export const getProviderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error("Invalid provider ID format.");
  }

  const provider = await User.findById(id)
    .select("providerProfile isActive")
    .lean();

  if (!provider) {
    res.status(404);
    throw new Error("Provider not found.");
  }

  res.status(200).json(provider);
});

// @desc    Get comprehensive provider profile with reviews and stats
export const getProviderProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error("Invalid provider ID format.");
  }

  // Get provider with enhanced profile data
  const provider = await User.findById(id)
    .select("providerProfile isActive email accountType")
    .lean();

  if (!provider || !["provider", "both"].includes(provider.accountType)) {
    res.status(404);
    throw new Error("Provider not found.");
  }

  // Get service requests for this provider
  const serviceRequests = await ServiceRequest.find({ providerId: id })
    .populate("userId", "userProfile.fullName userProfile.phone")
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // Get reviews for this provider
  const reviews = await Review.find({ reviewTo: id })
    .sort({ createdAt: -1 })
    .lean();

  // Calculate additional stats
  const totalRequests = await ServiceRequest.countDocuments({ providerId: id });
  const completedRequests = await ServiceRequest.countDocuments({
    providerId: id,
    status: "completed",
  });
  const pendingRequests = await ServiceRequest.countDocuments({
    providerId: id,
    status: "pending",
  });

  // Enhanced provider data
  const enhancedProvider = {
    ...provider,
    providerProfile: {
      ...provider.providerProfile,
      totalRequests,
      completedRequests,
      pendingRequests,
      acceptanceRate:
        totalRequests > 0
          ? ((completedRequests / totalRequests) * 100).toFixed(1)
          : 0,
      recentRequests: serviceRequests,
      reviews, // <-- add reviews here
    },
  };

  res.status(200).json({
    success: true,
    data: enhancedProvider.providerProfile,
  });
});

// @desc    Update provider profile
export const updateProviderProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Validate provider exists and user has permission
  const provider = await User.findById(id);
  if (!provider || !["provider", "both"].includes(provider.accountType)) {
    res.status(404);
    throw new Error("Provider not found.");
  }

  // Update provider profile fields
  const updatedProvider = await User.findByIdAndUpdate(
    id,
    {
      $set: { providerProfile: { ...provider.providerProfile, ...updateData } },
    },
    { new: true, runValidators: true }
  ).select("providerProfile");

  res.status(200).json({
    success: true,
    data: updatedProvider,
  });
});

// @desc    Upload provider profile photo
export const uploadProviderProfilePhoto = handleSingleFileUpload(
  providerPhotoConfig,
  "providerProfile.profilePhoto",
  "providerProfile.profilePhoto",
  "file"
);

// @desc    Upload gallery image
export const uploadGalleryImage = handleGalleryUpload(
  galleryUploadConfig,
  "providerProfile.gallery"
);

// @desc    Delete gallery image (S3 + DB)
export const deleteGalleryImage = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ message: "Image URL is required" });
  }

  // Remove from S3
  await deleteS3Object(imageUrl);

  // Remove from DB
  await User.findByIdAndUpdate(
    userId,
    { $pull: { "providerProfile.gallery": imageUrl } },
    { new: true }
  );

  res.status(200).json({ success: true, message: "Image deleted" });
});

// @desc    Get provider service requests
export const getProviderServiceRequests = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, page = 1, limit = 10 } = req.query;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error("Invalid provider ID format.");
  }

  const query = { providerId: id };
  if (status) query.status = status;

  const skip = (page - 1) * limit;

  const requests = await ServiceRequest.find(query)
    .populate(
      "userId",
      "userProfile.fullName userProfile.phone userProfile.email"
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

// @desc    Update service request status (accept/reject/complete)
export const updateServiceRequestStatus = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { status, responseMessage } = req.body;

  if (!["accepted", "rejected", "completed"].includes(status)) {
    res.status(400);
    throw new Error(
      "Invalid status. Must be 'accepted', 'rejected', or 'completed'."
    );
  }

  const request = await ServiceRequest.findById(requestId);
  if (!request) {
    res.status(404);
    throw new Error("Service request not found.");
  }

  const previousStatus = request.status;

  // Update request status
  request.status = status;
  
  // Only set responseTime if not already set (for accept/reject)
  // Don't overwrite responseTime on completion - preserve the original acceptance time
  if (status === "accepted" || status === "rejected") {
    request.responseTime = new Date();
  }
  
  if (responseMessage) request.responseMessage = responseMessage;
  await request.save();

  // FIXED: Update provider ratings on accept/reject
  const provider = await User.findById(request.providerId);
  if (provider) {
    if (status === "accepted") {
      // Get current provider data before incrementing
      const currentProvider = await User.findById(request.providerId);
      const currentTotalAccepted = currentProvider.providerProfile?.totalAccepted || 0;
      const currentTotalRejected = currentProvider.providerProfile?.totalRejected || 0;

      // Calculate new reputation: (accepted + 1) / (total + 1) * 5
      const newTotalProjects = currentTotalAccepted + currentTotalRejected + 1;
      const newReputationRate = ((currentTotalAccepted + 1) / newTotalProjects) * 5;

      // Calculate response time in minutes
      const requestTime = new Date(request.createdAt);
      const responseTime = new Date(request.responseTime);
      const responseTimeMinutes = (responseTime - requestTime) / (1000 * 60);

      // Calculate star rating for this response
      const newResponseStarRating = calculateResponseTimeStars(responseTimeMinutes);

      // Get current average response time and total responses
      const currentAvgResponseTime = currentProvider.providerProfile?.avgResponseTime || 0;
      const currentTotalResponses = currentProvider.providerProfile?.totalResponses || 0;

      // Calculate new average using running average formula
      const newAvgResponseTime = updateRunningAverage(
        currentAvgResponseTime,
        currentTotalResponses,
        newResponseStarRating
      );

      // Calculate overall rating using current review rating and newly calculated values
      const newOverallRating = calculateOverallRating({
        avgReviewRating: currentProvider.providerProfile?.avgReviewRating ?? null,
        avgResponseTime: newAvgResponseTime,
        avgRequestAcceptanceRate: newReputationRate,
      });

      // Update all counters, ratings, and overall rating in one operation
      await User.findByIdAndUpdate(request.providerId, {
        $inc: { 
          "providerProfile.projectsOngoing": 1,
          "providerProfile.totalAccepted": 1,
          "providerProfile.totalResponses": 1,
        },
        $set: {
          "providerProfile.avgRequestAcceptanceRate": newReputationRate,
          "providerProfile.avgResponseTime": newAvgResponseTime,
          "providerProfile.overallRating": newOverallRating,
        },
      });

    } else if (status === "rejected") {
      // Get current provider data before incrementing
      const currentProvider = await User.findById(request.providerId);
      const currentTotalAccepted = currentProvider.providerProfile?.totalAccepted || 0;
      const currentTotalRejected = currentProvider.providerProfile?.totalRejected || 0;

      // Calculate new reputation: accepted / (total + 1) * 5
      // Note: accepted stays the same, total increases by 1
      const newTotalProjects = currentTotalAccepted + currentTotalRejected + 1;
      const newReputationRate = newTotalProjects > 0 
        ? (currentTotalAccepted / newTotalProjects) * 5 
        : 0;

      // Calculate overall rating using current values and newly calculated reputation
      const newOverallRating = calculateOverallRating({
        avgReviewRating: currentProvider.providerProfile?.avgReviewRating ?? null,
        avgResponseTime: currentProvider.providerProfile?.avgResponseTime ?? null,
        avgRequestAcceptanceRate: newReputationRate,
      });

      // Increment rejected counter and update reputation and overall rating in one operation
      await User.findByIdAndUpdate(request.providerId, {
        $inc: { "providerProfile.totalRejected": 1 },
        $set: {
          "providerProfile.avgRequestAcceptanceRate": newReputationRate,
          "providerProfile.overallRating": newOverallRating,
        },
      });
    } else if (status === "completed") {
      
      await User.findByIdAndUpdate(request.providerId, {
        $inc: {
          "providerProfile.projectsOngoing": -1,
          "providerProfile.projectsDone": 1,
        },
      });
      
      // Explicitly return early to prevent any rating recalculation
      // Completion should never change response time, reputation, or overall rating
      return res.status(200).json({
        success: true,
        data: request,
      });
    }
  }

  res.status(200).json({
    success: true,
    data: request,
  });
});;

// @desc    Generate and send OTP for service completion
// @route   POST /api/providers/service-requests/:requestId/request-completion-otp
// @access  Private (Provider)
export const requestCompletionOtp = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  const request = await ServiceRequest.findById(requestId);
  if (!request) {
    return res.status(404).json({ message: "Service request not found" });
  }

  if (request.status !== "accepted") {
    return res.status(400).json({
      message: "Only accepted requests can be marked for completion",
    });
  }

  const customerEmail = request.customerDetails?.email;
  if (!customerEmail) {
    return res.status(400).json({
      message: "Customer email not found in request details",
    });
  }

  // Generate 6-digit OTP
  const otp = generateOTP();

  // Store in Redis with 60-minute expiration (3600 seconds)
  const otpKey = `completion-otp:${requestId}`;
  await redis.set(otpKey, otp, "EX", 3600);

  // Get provider details for email
  const provider = await User.findById(request.providerId);
  const providerName = provider?.providerProfile?.companyName || "Service Provider";

  // Send OTP email to customer
  await sendCompletionOtpEmail({
    to: customerEmail,
    otp,
    serviceName: request.serviceName,
    providerName,
  });

  res.status(200).json({
    success: true,
    message: `OTP sent to customer email (${customerEmail})`,
  });
});

// @desc    Resend OTP for service completion
// @route   POST /api/providers/service-requests/:requestId/resend-completion-otp
// @access  Private (Provider)
export const resendCompletionOtp = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  const request = await ServiceRequest.findById(requestId);
  if (!request) {
    return res.status(404).json({ message: "Service request not found" });
  }

  if (request.status !== "accepted") {
    return res.status(400).json({
      message: "Only accepted requests can be marked for completion",
    });
  }

  const customerEmail = request.customerDetails?.email;
  if (!customerEmail) {
    return res.status(400).json({
      message: "Customer email not found in request details",
    });
  }

  // Delete old OTP from Redis
  const otpKey = `completion-otp:${requestId}`;
  await redis.del(otpKey);

  // Generate new 6-digit OTP
  const otp = generateOTP();

  // Store new OTP with 60-minute expiration
  await redis.set(otpKey, otp, "EX", 3600);

  // Get provider details for email
  const provider = await User.findById(request.providerId);
  const providerName = provider?.providerProfile?.companyName || "Service Provider";

  // Send new OTP email with resend flag
  await sendCompletionOtpEmail({
    to: customerEmail,
    otp,
    serviceName: request.serviceName,
    providerName,
    isResend: true,
  });

  res.status(200).json({
    success: true,
    message: `New OTP sent to customer email (${customerEmail})`,
  });
});

// @desc    Verify completion OTP and complete service
export const verifyCompletionOtp = asyncHandler(async (req, res) => {
  const { requestId, otp } = req.body;

  if (!requestId || !otp) {
    return res.status(400).json({ message: "Request ID and OTP are required" });
  }

  const request = await ServiceRequest.findById(requestId);
  if (!request) {
    return res.status(404).json({ message: "Service request not found" });
  }

  if (request.status !== "accepted") {
    return res.status(400).json({ message: "Only accepted requests can be completed" });
  }

  // Verify OTP
  const otpKey = `completion-otp:${requestId}`;
  const storedOtp = await redis.get(otpKey);

  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // Complete the service
  request.status = "completed";
  request.completedAt = new Date();
  await request.save();

  // Update provider stats
  await User.findByIdAndUpdate(request.providerId, {
    $inc: {
      "providerProfile.projectsOngoing": -1,
      "providerProfile.projectsDone": 1,
    },
  });

  // Clean up OTP
  await redis.del(otpKey);

  // Send completion email to customer
  const provider = await User.findById(request.providerId);
  await sendCustomerServiceRequestStatusEmail({
    status: "completed",
    customerEmail: request.customerDetails.email,
    serviceName: request.serviceName,
    providerName: provider?.providerProfile?.companyName,
    description: request.description,
    preferredDate: request.preferredDate,
    location: request.location,
    budget: request.budget,
    propertyType: request.propertyType,
    timeline: request.timeline,
  });

  res.status(200).json({
    success: true,
    message: "Service completed successfully",
    data: request,
  });
});

// @desc    Get provider analytics and stats
export const getProviderAnalytics = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { period = "30" } = req.query; // days

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error("Invalid provider ID format.");
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(period));

  // Get requests in the specified period
  const requests = await ServiceRequest.find({
    providerId: id,
    createdAt: { $gte: startDate },
  }).lean();

  // Calculate analytics
  const analytics = {
    totalRequests: requests.length,
    acceptedRequests: requests.filter((r) => r.status === "accepted").length,
    rejectedRequests: requests.filter((r) => r.status === "rejected").length,
    pendingRequests: requests.filter((r) => r.status === "pending").length,
    acceptanceRate:
      requests.length > 0
        ? (
            (requests.filter((r) => r.status === "accepted").length /
              requests.length) *
            100
          ).toFixed(1)
        : 0,
    averageResponseTime: "2.5 hours", // This would be calculated from actual response times
    topServices: [], // Would be calculated from service requests
    monthlyTrend: [], // Would be calculated for chart display
  };

  res.status(200).json({
    success: true,
    data: analytics,
  });
});

// @desc    Request provider verification (pending -> requested)
export const requestProviderVerification = asyncHandler(async (req, res) => {
  const { authenticatedID } = req;

  // Only allow the provider themselves to request verification
  if (!req.user || req.user._id.toString() !== authenticatedID) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const provider = await User.findById(authenticatedID);
  if (!provider || !["provider", "both"].includes(provider.accountType)) {
    return res.status(404).json({ message: "Provider not found" });
  }

  // Initialize verification object if it doesn't exist
  if (!provider.providerProfile.verification) {
    provider.providerProfile.verification = {};
  }

  const currentStatus = provider.providerProfile.verification.status;

  // Only allow requesting verification if status is 'pending' or 'rejected'
  if (currentStatus === "requested") {
    return res.status(400).json({
      message: "Verification already requested. Please wait for admin review.",
    });
  }

  if (currentStatus === "verified") {
    return res.status(400).json({
      message: "You are already verified.",
    });
  }

  // Update status to requested
  provider.providerProfile.verification.status = "requested";
  provider.providerProfile.verification.requestedAt = new Date();

  await provider.save();

  res.status(200).json({
    success: true,
    message:
      currentStatus === "rejected"
        ? "Verification re-requested successfully"
        : "Verification requested successfully",
    data: {
      status: provider.providerProfile.verification.status,
      requestedAt: provider.providerProfile.verification.requestedAt,
    },
  });
});

export const createChangeRequest = async (req, res) => {
  try {
    const { description } = req.body;
    const providerId = req.authenticatedID; // assuming auth middleware sets req.user
    if (!description) {
      return res.status(400).json({ message: "Description is required." });
    }
    // Fetch provider
    const provider = await User.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found." });
    }

    // Ensure object exists
    if (!provider.providerProfile) {
      provider.providerProfile = {};
    }

    // Handle freeChangeRequests logic and tag
    let tag = "paid";
    if (provider.providerProfile.freeChangeRequests !== undefined) {
      if (provider.providerProfile.freeChangeRequests > 0) {
        provider.providerProfile.freeChangeRequests -= 1;
        tag = "free";
      } else {
        provider.providerProfile.freeChangeRequests = 0;
        tag = "paid";
      }
    } else {
      provider.providerProfile.freeChangeRequests = 9;
      tag = "free";
    }
    provider.markModified("providerProfile");
    await provider.save();

    const changeRequest = await ChangeRequest.create({
      providerId,
      description,
      tag,
    });
    res.status(201).json({ success: true, data: changeRequest });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};