import Review from "../models/Review.js";
import User from "../models/User.js";

// Get all reviews for a provider
export const getReviews = async (req, res) => {
  try {
    const { providerId } = req.query;
    if (!providerId) {
      return res.status(400).json({ message: "providerId is required" });
    }
    // Populate reviewBy with userProfile.profilePhoto and userProfile.fullName
    const reviews = await Review.find({ reviewTo: providerId })
      .sort({ createdAt: -1 })
      .populate({
        path: "reviewBy",
        select: "userProfile.profilePhoto userProfile.fullName",
      });
    res.status(200).json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch reviews", error: error.message });
  }
};

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { reviewBy, reviewTo, stars, reviewTitle, reviewDescription } =
      req.body;
    if (!reviewBy || !reviewTo || !stars || !reviewTitle) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const review = new Review({
      reviewBy,
      reviewTo,
      stars,
      reviewTitle,
      reviewDescription,
    });
    await review.save();

    res.status(201).json(review);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create review", error: error.message });
  }
};

// Get all reviews made by a user
export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    // Populate reviewTo with providerProfile.companyName and providerProfile.profilePhoto
    const reviews = await Review.find({ reviewBy: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "reviewTo",
        select: "providerProfile.companyName providerProfile.profilePhoto",
      });
    res.status(200).json(reviews);
    console.log(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user reviews", error: error.message });
  }
};
