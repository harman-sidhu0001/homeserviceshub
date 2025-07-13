import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePhoto,
  uploadVerificationDocuments,
  getUserProfileDetailed,
  getUserServiceHistory,
  addToBookmarks,
  removeFromBookmarks,
  getUserBookmarks,
  requestService,
  cancelServiceRequest,
  rateService,
  listNearbyProviders,
  notifyUserOnBooking,
} from "../controllers/userController.js";

const router = express.Router();

// Protected routes (require authentication)
router.use(authenticate);

// Profile management
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.get("/profile/detailed", getUserProfileDetailed);
router.get("/service-history", getUserServiceHistory);

// File uploads
router.post("/upload-profile-photo", uploadProfilePhoto);
router.post("/upload/verification-documents", uploadVerificationDocuments);

// Bookmarks
router.post("/bookmarks", addToBookmarks);
router.delete("/bookmarks/:providerId", removeFromBookmarks);
router.get("/bookmarks", getUserBookmarks);

// Service requests
router.post("/request-service", requestService);
router.put("/cancel-request/:requestId", cancelServiceRequest);
router.post("/rate-service/:requestId", rateService);

// Location-based services
router.get("/nearby-providers", listNearbyProviders);

// Booking notification
router.post("/notify-booking", notifyUserOnBooking);

export default router;
