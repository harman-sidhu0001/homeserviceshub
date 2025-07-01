import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
  listNearbyProviders,
  requestService,
  cancelServiceRequest,
} from "../controllers/userController.js";

const router = express.Router();

// Authenticated User-only routes
router.get(
  "/profile",
  authenticate,
  authorizeRoles("user", "both"),
  getUserProfile
);
router.put(
  "/profile",
  authenticate,
  authorizeRoles("user", "both"),
  updateUserProfile
);
router.get(
  "/providers/nearby",
  authenticate,
  authorizeRoles("user", "both"),
  listNearbyProviders
);
router.post(
  "/request-service",
  authenticate,
  authorizeRoles("user", "both"),
  requestService
);
router.delete(
  "/request-service/:requestId/cancel",
  authenticate,
  authorizeRoles("user", "both"),
  cancelServiceRequest
);

export default router;
