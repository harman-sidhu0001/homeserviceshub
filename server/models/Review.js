import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    reviewBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stars: { type: Number, min: 1, max: 5, required: true },
    date: { type: Date, default: Date.now },
    reviewTitle: { type: String, required: true },
    reviewDescription: { type: String },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);
export default Review;
