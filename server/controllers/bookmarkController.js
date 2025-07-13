import Bookmark from "../models/Bookmark.js";
import asyncHandler from "../utils/asyncHandler.js";

// Add bookmark
export const addBookmark = asyncHandler(async (req, res) => {
  const { providerId } = req.body;
  const userId = req.authenticatedID;
  if (!providerId || !userId)
    return res.status(400).json({ message: "Missing providerId or userId" });
  await Bookmark.create({ userId, providerId });
  res.status(201).json({ success: true });
});

// Remove bookmark
export const removeBookmark = asyncHandler(async (req, res) => {
  const { providerId } = req.body;
  const userId = req.authenticatedID;
  if (!providerId || !userId)
    return res.status(400).json({ message: "Missing providerId or userId" });
  await Bookmark.deleteOne({ userId, providerId });
  res.status(200).json({ success: true });
});

// Check if bookmarked
export const isBookmarked = asyncHandler(async (req, res) => {
  const userId = req.authenticatedID;
  const providerId = req.query.providerId;
  if (!userId || !providerId)
    return res.status(400).json({ bookmarked: false });
  const exists = await Bookmark.exists({ userId, providerId });
  res.json({ bookmarked: !!exists });
});
