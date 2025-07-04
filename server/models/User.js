import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    accountType: {
      type: String,
      enum: ["user", "provider", "both"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    userProfile: {
      fullName: String,
      email: String,
      passwordHash: String,
      phone: String,
      profilePhoto: String,
      location: String,
    },

    providerProfile: {
      companyName: String,
      providerPass: String,
      providerEmail: String,
      phone: String,
      profilePhoto: String,
      location: String,
      intro: String,
      totalReviews: Number,
      overallRating: Number,
      avgReviewRating: Number,
      avgResponseTime: Number,
      avgRequestAcceptanceRate: Number,
      availability: { type: [String], default: undefined },
      projectsDone: Number,
      projectsOngoing: Number,
      yearOfEstablishment: Number,
      paymentMethods: { type: [String], default: undefined },
      services: { type: [String], default: undefined },
      serviceAreas: { type: [String], default: undefined },
      totalWorkers: Number,
      gallery: { type: [String], default: undefined }, // Image URLs
      awards: { type: [String], default: undefined },
      subscriptionPlan: String,
      verification: {
        status: {
          type: String,
          enum: ["pending", "requested", "verified", "rejected"],
          default: undefined,
        },
        idProof: {
          aadhaarFront: {
            documentName: String,
            documentUrl: String,
          },
          aadhaarBack: {
            documentName: String,
            documentUrl: String,
          },
          panCard: {
            documentName: String,
            documentUrl: String,
          },
          gstNumber: String,
        },
      },
      otherSpecifics: {
        type: mongoose.Schema.Types.Mixed,
        default: undefined,
      },
    },

    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true, minimize: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
