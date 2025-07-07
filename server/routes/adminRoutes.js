import express from "express";
import {
  deactivateUser,
  getAllProviders,
  getAllServiceRequests,
  getAllUsers,
  getPlatformStats,
  getTopCities,
  getWeeklyRequestTrend,
  loginAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
  updateProviderByAdmin,
  deleteProviderByAdmin,
  activateUser,
  activateProvider,
} from "../controllers/adminController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin login
router.post("/login", loginAdmin);
router.get("/users", authenticate, authorizeRoles("admin"), getAllUsers);
router.get(
  "/providers",
  authenticate,
  authorizeRoles("admin"),
  getAllProviders
);
router.get(
  "/requests",
  authenticate,
  authorizeRoles("admin"),
  getAllServiceRequests
);
router.put(
  "/user/:userId/deactivate",
  authenticate,
  authorizeRoles("admin"),
  deactivateUser
);
router.put(
  "/user/:userId",
  authenticate,
  authorizeRoles("admin"),
  updateUserByAdmin
);
router.delete(
  "/user/:userId",
  authenticate,
  authorizeRoles("admin"),
  deleteUserByAdmin
);
router.put(
  "/provider/:providerId",
  authenticate,
  authorizeRoles("admin"),
  updateProviderByAdmin
);
router.delete(
  "/provider/:providerId",
  authenticate,
  authorizeRoles("admin"),
  deleteProviderByAdmin
);
router.put(
  "/user/:userId/activate",
  authenticate,
  authorizeRoles("admin"),
  activateUser
);
router.put(
  "/provider/:providerId/activate",
  authenticate,
  authorizeRoles("admin"),
  activateProvider
);
router.get("/stats", authenticate, authorizeRoles("admin"), getPlatformStats);
router.get("/top-cities", authenticate, authorizeRoles("admin"), getTopCities);
router.get(
  "/weekly-trend",
  authenticate,
  authorizeRoles("admin"),
  getWeeklyRequestTrend
);

export default router;
