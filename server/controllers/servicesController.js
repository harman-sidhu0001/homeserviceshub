import Services from "../models/Services.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAllServices = asyncHandler(async (req, res) => {
  const services = await Services.find({});
  if (!services || services.length === 0) {
    return res.status(404).json({ message: "No services in the database" });
  }
  res.status(200).json({ success: true, data: services });
});
