import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  getServiceProviders,
  getProviderById,
  getProviderProfile,
  updateProviderProfile,
  uploadProviderProfilePhoto,
  uploadGalleryImage,
  getProviderServiceRequests,
  updateServiceRequestStatus,
  requestCompletionOtp,
  resendCompletionOtp,
  verifyCompletionOtp,
  getProviderAnalytics,
  requestProviderVerification,
  createChangeRequest,
  deleteGalleryImage,
} from "../controllers/providerController.js";

const router = express.Router();

// Public routes
router.get("/", getServiceProviders);
router.get("/:id", getProviderById);
router.get("/:id/profile", getProviderProfile);

// Protected routes (require authentication)
router.use(authenticate);

// Profile management
router.put("/:id/profile", updateProviderProfile);
router.post("/request-verification", authenticate, requestProviderVerification);
router.post("/change-request", authenticate, createChangeRequest);

// File uploads
router.post("/upload/profile-photo", uploadProviderProfilePhoto);
router.post("/upload/gallery-image", uploadGalleryImage);
router.delete("/gallery-image", authenticate, deleteGalleryImage);

// Service requests management
router.get("/:id/service-requests", getProviderServiceRequests);
router.put("/service-requests/:requestId/status", updateServiceRequestStatus);
router.post("/service-requests/:requestId/request-completion-otp", requestCompletionOtp);
router.post("/service-requests/:requestId/resend-completion-otp", resendCompletionOtp);
router.post("/verify-completion-otp", verifyCompletionOtp); // OTP verification for completion

// Analytics
router.get("/:id/analytics", getProviderAnalytics);

export default router;