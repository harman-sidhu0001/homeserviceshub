import User from "../models/User.js";
import Services from "../models/Services.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getServiceProviders = asyncHandler(async (req, res) => {
  let { service, city = "amritsar", sortBy = "reviews" } = req.query;

  if (!service) {
    return res.status(400).json({ message: "Service or query is required" });
  }

  const searchTerm = service.trim().toLowerCase();

  // 🔍 Step 1: Find service names related to the search term
  const matchedServices = await Services.find({
    $or: [
      { name: { $regex: new RegExp(`^${searchTerm}$`, "i") } },
      { similarWords: { $regex: new RegExp(searchTerm, "i") } },
    ],
  }).select("name");

  const matchedServiceNames = matchedServices.map((s) => s.name);
  console.log(matchedServiceNames);
  // 🔠 Normalize all to lowercase for case-insensitive match
  const allServiceTerms = [
    ...new Set([searchTerm, ...matchedServiceNames]),
  ].map((s) => s.toLowerCase());

  // 🔧 Step 2: Build sort options
  let sortOptions = {};
  switch (sortBy) {
    case "rating":
      sortOptions = { "providerProfile.overallRating": -1 };
      break;
    case "projects":
      sortOptions = { "providerProfile.projectsDone": -1 };
      break;
    default:
      sortOptions = { "providerProfile.totalReviews": -1 };
      break;
  }

  // 🧠 Step 3: Build aggregation pipeline
  const pipeline = [
    {
      $match: {
        accountType: { $in: ["provider", "both"] },
        "providerProfile.location": { $regex: city, $options: "i" },
        $or: [
          { "providerProfile.services": { $exists: true, $ne: [] } },
          {
            "providerProfile.companyName": {
              $regex: new RegExp(searchTerm, "i"),
            },
          },
        ],
      },
    },
    {
      $project: {
        providerProfile: 1,
        email: 1,
        matchedByService: {
          $gt: [
            {
              $size: {
                $setIntersection: [
                  {
                    $map: {
                      input: "$providerProfile.services",
                      as: "s",
                      in: { $toLower: "$$s" },
                    },
                  },
                  allServiceTerms,
                ],
              },
            },
            0,
          ],
        },
        matchedByCompany: {
          $regexMatch: {
            input: "$providerProfile.companyName",
            regex: new RegExp(searchTerm, "i"),
          },
        },
      },
    },
    {
      $sort: sortOptions,
    },
  ];

  const providers = await User.aggregate(pipeline);

  const data1 = providers.filter((p) => p.matchedByService);
  const data2 = providers.filter((p) => p.matchedByCompany);

  return res.status(200).json({
    success: true,
    data1,
    data2,
  });
});

export const getProviderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error("Invalid provider ID format.");
  }

  const provider = await User.findById(id)
    .select("providerProfile isActive")
    .lean();

  if (!provider) {
    res.status(404);
    throw new Error("Provider not found.");
  }

  res.status(200).json(provider);
});
