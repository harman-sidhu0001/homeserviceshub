import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    serviceName: { type: String, required: true },
    description: { type: String },
    preferredDate: { type: Date, required: true },
    location: { type: String },
    budget: { type: Number },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
      default: "pending",
    },
    responseMessage: { type: String },
    review: {
      rating: { type: Number, min: 1, max: 5 },
      review: { type: String },
      serviceQuality: { type: Number, min: 1, max: 5 },
      professionalism: { type: Number, min: 1, max: 5 },
      valueForMoney: { type: Number, min: 1, max: 5 },
      reviewedAt: { type: Date },
    },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    cancelledBy: { type: String, enum: ["user", "provider"] },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
serviceRequestSchema.index({ userId: 1, createdAt: -1 });
serviceRequestSchema.index({ providerId: 1, createdAt: -1 });
serviceRequestSchema.index({ status: 1 });

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);
export default ServiceRequest;
