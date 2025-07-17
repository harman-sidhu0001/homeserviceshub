import asyncHandler from "./asyncHandler.js";
import User from "../models/User.js";
import { s3Client } from "../config/s3Config.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

// Generic single file upload handler
export const handleSingleFileUpload = (
  multerInstance,
  updateField,
  selectFields = "",
  fieldName = "file"
) => {
  return asyncHandler(async (req, res) => {
    multerInstance.single(fieldName)(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({
          success: false,
          message: err.message || "File upload failed",
        });
      }

      if (!req.file) {
        console.error("No file in request");
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      try {
        // Update user/provider with the uploaded file URL
        const updateData = { [updateField]: req.file.location };
        const updatedDoc = await User.findByIdAndUpdate(
          req.user._id,
          { $set: updateData },
          { new: true }
        ).select(selectFields);

        res.status(200).json({
          success: true,
          message: "File uploaded successfully",
          data: {
            fileUrl: req.file.location,
            document: updatedDoc,
          },
        });
      } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
          success: false,
          message: "Failed to update document",
          error: error.message,
        });
      }
    });
  });
};

// Generic multiple files upload handler
export const handleMultipleFilesUpload = (
  multerInstance,
  updateField,
  processFiles,
  fields = []
) => {
  return asyncHandler(async (req, res) => {
    multerInstance.fields(fields)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "File upload failed",
        });
      }

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      try {
        // Process uploaded files using custom function
        const processedData = processFiles(req.files);

        // Update document with processed data
        const updatedDoc = await User.findByIdAndUpdate(
          req.user._id,
          { $set: { [updateField]: processedData } },
          { new: true }
        ).select(`${updateField}`);

        res.status(200).json({
          success: true,
          message: "Files uploaded successfully",
          data: {
            processedData,
            document: updatedDoc,
          },
        });
      } catch (error) {
        console.error("Multiple files upload error:", error);
        res.status(500).json({
          success: false,
          message: "Failed to update document",
          error: error.message,
        });
      }
    });
  });
};

// Gallery upload handler (appends to array)
export const handleGalleryUpload = (multerInstance, updateField) => {
  return asyncHandler(async (req, res) => {
    multerInstance.single("galleryImage")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "File upload failed",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      try {
        // Get current document to access existing gallery
        let currentGallery = [];
        if (updateField === "providerProfile.gallery") {
          const currentDoc = await User.findById(req.user._id);
          currentGallery =
            (currentDoc.providerProfile &&
              currentDoc.providerProfile.gallery) ||
            [];
        } else {
          const currentDoc = await User.findById(req.user._id);
          currentGallery = currentDoc[updateField] || [];
        }

        // Add new file to gallery
        const updatedGallery = [...currentGallery, req.file.location];

        // Update document gallery
        const updatedDoc = await User.findByIdAndUpdate(
          req.user._id,
          { $set: { [updateField]: updatedGallery } },
          { new: true }
        ).select(updateField);

        res.status(200).json({
          success: true,
          message: "Gallery image uploaded successfully",
          data: {
            gallery: updatedGallery,
            document: updatedDoc,
          },
        });
      } catch (error) {
        console.error("Gallery upload error:", error);
        res.status(500).json({
          success: false,
          message: "Failed to update gallery",
          error: error.message,
        });
      }
    });
  });
};

export const deleteS3Object = async (fileUrl) => {
  // Parse bucket and key from fileUrl
  const url = new URL(fileUrl);
  const Bucket = process.env.AWS_S3_BUCKET_NAME || "homeserviceshubbucket";
  const Key = decodeURIComponent(url.pathname.substring(1));
  const command = new DeleteObjectCommand({ Bucket, Key });
  await s3Client.send(command);
};
