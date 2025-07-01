import User from "../models/User.js";

// Find providers near a given point
export const findNearbyProviders = async (coordinates, maxDistance = 5000) => {
  return await User.find({
    accountType: { $in: ["provider", "both"] },
    "providerProfile.geoLocation": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates,
        },
        $maxDistance: maxDistance, // in meters
      },
    },
  }).select("providerProfile companyName");
};
