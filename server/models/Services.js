import mongoose from "mongoose";

const servicesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, required: true, default: "FaTools" },
  },
  { timestamps: true }
);

const Services = mongoose.model("services", servicesSchema);

export default Services;
