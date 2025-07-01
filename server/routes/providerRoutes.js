import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  getProviderProfile,
  updateProviderProfile,
  getServiceRequests,
  respondToRequest,
} from "../controllers/providerController.js";

const router = express.Router();

// Authenticated Provider routes
router.get(
  "/profile",
  authenticate,
  authorizeRoles("provider", "both"),
  getProviderProfile
);
router.put(
  "/profile",
  authenticate,
  authorizeRoles("provider", "both"),
  updateProviderProfile
);
router.get(
  "/requests",
  authenticate,
  authorizeRoles("provider", "both"),
  getServiceRequests
);
router.post(
  "/requests/:id/respond",
  authenticate,
  authorizeRoles("provider", "both"),
  respondToRequest
);

export default router;
