import express from "express";
import {
  getReviews,
  createReview,
  getUserReviews,
} from "../controllers/reviewController.js";

const router = express.Router();

// GET /api/reviews?providerId=...
router.get("/", getReviews);

// POST /api/reviews
router.post("/", createReview);

// GET /api/reviews/user/:userId
router.get("/user/:userId", getUserReviews);

export default router;
