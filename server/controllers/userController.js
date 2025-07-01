import User from "../models/User.js";
import ServiceRequest from "../models/ServiceRequest.js";
import asyncHandler from "../utils/asyncHandler.js";
import { findNearbyProviders } from "../services/locationService.js";

// @desc    Get logged-in user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json({ success: true, user });
});

// @desc    Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, phone, location } = req.body;

  const updatedFields = {};
  if (fullName) updatedFields["userProfile.fullName"] = fullName;
  if (phone) updatedFields["userProfile.phone"] = phone;
  if (location) updatedFields["userProfile.location"] = location;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updatedFields },
    { new: true }
  );

  res.status(200).json({ success: true, user: updatedUser });
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
  const { providerId, serviceName, description, preferredDate } = req.body;

  if (!providerId || !serviceName || !preferredDate) {
    return res.status(400).json({ message: "Missing required fields" });
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
    preferredDate,
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

  await ServiceRequest.findByIdAndDelete(requestId);

  res
    .status(200)
    .json({ success: true, message: "Request cancelled successfully" });
});
