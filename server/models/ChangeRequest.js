import mongoose from "mongoose";

const ChangeRequestSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["requested", "completed", "rejected"],
    default: "requested",
  },
  tag: {
    type: String,
    enum: ["free", "paid"],
    default: "free",
  },
});

const ChangeRequest = mongoose.model("ChangeRequest", ChangeRequestSchema);
export default ChangeRequest;
