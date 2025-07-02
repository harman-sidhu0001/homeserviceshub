import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Get service providers by service and location
// @route   GET /api/providers
// @access  Public
export const getServiceProviders = asyncHandler(async (req, res) => {
  let { service, city = "amritsar", sortBy = "reviews", q = "" } = req.query;

  if (!service && !q) {
    return res.status(400).json({ message: "Service is required" });
  }

  const searchTerm = q?.trim() || service?.trim();

  // Build sort options
  let sortOptions = {};
  switch (sortBy) {
    case "rating":
      sortOptions = { "providerProfile.rating": -1 };
      break;
    case "projects":
      sortOptions = { "providerProfile.projectsCompleted": -1 };
      break;
    default:
      sortOptions = { "providerProfile.reviewsCount": -1 };
      break;
  }

  const baseFilter = {
    accountType: { $in: ["provider", "both"] },
    "providerProfile.location": { $regex: city, $options: "i" },
  };

  const serviceMatchQuery = {
    ...baseFilter,
    "providerProfile.services": { $regex: searchTerm, $options: "i" },
  };

  const companyMatchQuery = {
    ...baseFilter,
    "providerProfile.companyName": { $regex: searchTerm, $options: "i" },
  };

  const [serviceMatches, companyMatches] = await Promise.all([
    User.find(serviceMatchQuery)
      .sort(sortOptions)
      .select("email providerProfile"),
    User.find(companyMatchQuery)
      .sort(sortOptions)
      .select("email providerProfile"),
  ]);

  res.status(200).json({
    success: true,
    data1: serviceMatches,
    data2: companyMatches,
  });
});
