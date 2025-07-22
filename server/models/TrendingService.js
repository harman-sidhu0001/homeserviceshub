import mongoose from "mongoose";

const trendingServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, required: true, default: "FaTools" },
    locations: { type: [String], required: true },
    similarWords: { type: [String], required: true },
    url: { type: String },
  },
  { timestamps: true }
);

const TrendingService = mongoose.model(
  "trendingservices",
  trendingServiceSchema
);

export default TrendingService;
