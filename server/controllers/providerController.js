import User from "../models/User.js";
import ServiceRequest from "../models/ServiceRequest.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Get provider profile
export const getProviderProfile = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!["provider", "both"].includes(user.accountType)) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.status(200).json({ success: true, provider: user.providerProfile });
});

// @desc    Update provider profile
export const updateProviderProfile = asyncHandler(async (req, res) => {
  const { companyName, services, coordinates, availability } = req.body;

  const updates = {};
  if (companyName) updates["providerProfile.companyName"] = companyName;
  if (services) updates["providerProfile.services"] = services;
  if (typeof availability === "boolean")
    updates["providerProfile.availability"] = availability;
  if (coordinates) {
    updates["providerProfile.geoLocation"] = {
      type: "Point",
      coordinates,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true }
  );
  res
    .status(200)
    .json({ success: true, provider: updatedUser.providerProfile });
});

// @desc    Get all service requests assigned to this provider
export const getServiceRequests = asyncHandler(async (req, res) => {
  const requests = await ServiceRequest.find({ providerId: req.user._id }).sort(
    { createdAt: -1 }
  );
  res.status(200).json({ success: true, requests });
});

// @desc    Accept or reject a service request
export const respondToRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'accept' or 'reject'

  const request = await ServiceRequest.findOne({
    _id: id,
    providerId: req.user._id,
  });
  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  if (!["accept", "reject"].includes(action)) {
    return res.status(400).json({ message: "Invalid action" });
  }

  request.status = action === "accept" ? "accepted" : "rejected";
  await request.save();

  res.status(200).json({ success: true, updatedStatus: request.status });
});
