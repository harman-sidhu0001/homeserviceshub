import mongoose from "mongoose";

const BookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

BookmarkSchema.index({ userId: 1, providerId: 1 }, { unique: true });

const Bookmark = mongoose.model("Bookmark", BookmarkSchema);
export default Bookmark;
