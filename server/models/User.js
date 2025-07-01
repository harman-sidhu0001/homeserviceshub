import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    accountType: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    email: {
      type: String,
    },
    passwordHash: {
      type: String,
    },
    userProfile: {
      type: Object,
      required: false,
    },
    providerProfile: {
      type: Object,
      required: false,
    },

    resetToken: String,
    resetTokenExpiry: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
