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
import { updateServiceRequestRatings } from "../utils/ratingCalculator.js";
import ChangeRequest from "../models/ChangeRequest.js";

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
    status: "accepted",
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

  // Update request status and response time
  request.status = status;
  request.responseTime = new Date();
  if (responseMessage) request.responseMessage = responseMessage;
  await request.save();

  // Update provider stats based on status
  if (status === "accepted") {
    // When provider accepts a request, increment ongoing projects
    await User.findByIdAndUpdate(request.providerId, {
      $inc: { "providerProfile.projectsOngoing": 1 },
    });
  } else if (status === "completed") {
    // When provider marks as completed, decrement ongoing and increment completed
    await User.findByIdAndUpdate(request.providerId, {
      $inc: {
        "providerProfile.projectsOngoing": -1,
        "providerProfile.projectsDone": 1,
      },
    });
  }

  // Update provider ratings
  const provider = await User.findById(request.providerId);
  if (provider) {
    // Get all service requests for this provider
    const allRequests = await ServiceRequest.find({
      providerId: request.providerId,
    });

    // Prepare provider data for rating calculation
    const providerData = {
      ...provider.toObject(),
      requests: allRequests,
      avgReviewRating: provider.providerProfile?.avgReviewRating || 0,
    };

    // Calculate updated service request ratings (response time and acceptance rate)
    const ratingsUpdated = updateServiceRequestRatings(providerData);

    // Update provider with new service request ratings
    await User.findByIdAndUpdate(request.providerId, {
      "providerProfile.avgResponseTime": ratingsUpdated.avgResponseTime,
      "providerProfile.avgRequestAcceptanceRate":
        ratingsUpdated.avgRequestAcceptanceRate,
      "providerProfile.overallRating": ratingsUpdated.overallRating,
    });
  }

  res.status(200).json({
    success: true,
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
