import Services from "../models/Services.js";
import asyncHandler from "../utils/asyncHandler.js";
import TrendingService from "../models/TrendingService.js";

export const getAllServices = asyncHandler(async (req, res) => {
  const services = await Services.find({});
  if (!services || services.length === 0) {
    return res.status(404).json({ message: "No services in the database" });
  }
  res.status(200).json({ success: true, data: services });
});

// Get 2 random trending services
export const getRandomTrendingServices = async (req, res) => {
  try {
    const trending = await TrendingService.aggregate([
      { $sample: { size: 2 } },
    ]);
    res.status(200).json({ success: true, data: trending });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all trending services
export const getAllTrendingServices = asyncHandler(async (req, res) => {
  const trending = await TrendingService.find({});
  res.status(200).json({ success: true, data: trending });
});

// Admin: Get trending service by ID
export const getTrendingServiceById = asyncHandler(async (req, res) => {
  const trending = await TrendingService.findById(req.params.id);
  if (!trending) return res.status(404).json({ message: "Not found" });
  res.status(200).json({ success: true, data: trending });
});

// Admin: Create trending service
export const createTrendingService = asyncHandler(async (req, res) => {
  const trending = await TrendingService.create(req.body);
  res.status(201).json({ success: true, data: trending });
});

// Admin: Update trending service
export const updateTrendingService = asyncHandler(async (req, res) => {
  const trending = await TrendingService.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!trending) return res.status(404).json({ message: "Not found" });
  res.status(200).json({ success: true, data: trending });
});

// Admin: Delete trending service
export const deleteTrendingService = asyncHandler(async (req, res) => {
  const trending = await TrendingService.findByIdAndDelete(req.params.id);
  if (!trending) return res.status(404).json({ message: "Not found" });
  res.status(200).json({ success: true, message: "Deleted" });
});

// Create a new service
export const createService = asyncHandler(async (req, res) => {
  const service = await Services.create(req.body);
  res.status(201).json({ success: true, data: service });
});

// Update a service
export const updateService = asyncHandler(async (req, res) => {
  const service = await Services.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!service) return res.status(404).json({ message: "Not found" });
  res.status(200).json({ success: true, data: service });
});

// Delete a service
export const deleteService = asyncHandler(async (req, res) => {
  const service = await Services.findByIdAndDelete(req.params.id);
  if (!service) return res.status(404).json({ message: "Not found" });
  res.status(200).json({ success: true, message: "Deleted" });
});
