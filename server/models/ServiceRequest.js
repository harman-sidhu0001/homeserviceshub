import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
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
    requestDate: { type: Date, default: Date.now },
    responseTime: { type: Date },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    serviceName: { type: String, required: true },
    description: { type: String },
    preferredDate: { type: Date },
    location: { type: String },
    budget: { type: Number },
    propertyType: { type: String, enum: ["home", "commercial"] },
    timeline: { type: String },
    customerDetails: {
      name: { type: String },
      phone: { type: String },
      address: { type: String },
      email: { type: String },
    },
    review: {
      rating: { type: Number, min: 1, max: 5 },
      review: { type: String },
      serviceQuality: { type: Number },
      professionalism: { type: Number },
      valueForMoney: { type: Number },
      reviewedAt: { type: Date },
    },
  },
  { timestamps: true }
);

// Index for better query performance
serviceRequestSchema.index({ userId: 1, createdAt: -1 });
serviceRequestSchema.index({ providerId: 1, createdAt: -1 });
serviceRequestSchema.index({ status: 1 });

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);
export default ServiceRequest;
