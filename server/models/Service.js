// models/Service.js
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      immutable: true,
    },
    name: {
      type: String,
      required: true,
      index: "text",
    },
    icon: {
      type: String,
      required: true,
      match: /^[a-z0-9-]+$/, // Ensures icon filename safety
    },
    categories: {
      type: [String],
      required: true,
      index: true,
      enum: ["plumbing", "electrical", "carpentry"], // Controlled vocabulary
    },
    priceRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    popularity: {
      type: Number,
      default: 0,
      index: -1, // Descending index for "top services" queries
    },
    metadata: {
      seoTitle: String,
      seoDescription: String,
      // ... other SEO fields
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for category-based price filtering
serviceSchema.index({
  categories: 1,
  "priceRange.min": 1,
  "priceRange.max": 1,
});

// Auto-increment popularity on access
serviceSchema.methods.incrementPopularity = async function () {
  this.popularity += 1;
  await this.save();
};

export default mongoose.model("Service", serviceSchema);
