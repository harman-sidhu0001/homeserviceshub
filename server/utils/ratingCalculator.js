/**
 * Provider Rating System Calculator
 * Calculates and updates provider ratings based on various metrics
 */

/**
 * Calculate average rating based on user reviews
 * @param {Array} reviews - Array of review objects with stars property
 * @returns {number} Average rating between 0 and 5
 */
export const calculateAvgRating = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return 0;
  }

  const totalStars = reviews.reduce(
    (sum, review) => sum + (review.stars || 0),
    0
  );

  return reviews.length > 0 ? totalStars / reviews.length : 0;
};

/**
 * Calculate average response time rating based on response times
 * Includes accepted, rejected, and completed requests (all have response times)
 * @param {Array} requests - Array of service request objects
 * @returns {number} Average rating between 0 and 5
 */
export const calculateAvgResponseTime = (requests) => {
  if (!requests || requests.length === 0) {
    return 0;
  }

  // Filter requests that have been responded to (accepted, rejected, or completed)
  // Completed requests should be included as they have response times from when they were accepted
  const respondedRequests = requests.filter(
    (request) =>
      request.status === "accepted" ||
      request.status === "rejected" ||
      request.status === "completed"
  );

  if (respondedRequests.length === 0) {
    return 0;
  }

  const responseTimeScores = respondedRequests.map((request) => {
    if (!request.createdAt || !request.responseTime) {
      return 0; // Skip requests without proper timestamps
    }

    const requestTime = new Date(request.createdAt);
    const responseTime = new Date(request.responseTime);
    const responseTimeMinutes = (responseTime - requestTime) / (1000 * 60);

    // Assign stars based on response time (1-5 scale)
    let stars;
    if (responseTimeMinutes <= 5) {
      stars = 5; // Excellent: ≤5 minutes
    } else if (responseTimeMinutes <= 15) {
      stars = 4; // Good: ≤15 minutes
    } else if (responseTimeMinutes <= 60) {
      stars = 3; // Average: ≤1 hour
    } else if (responseTimeMinutes <= 300) {
      stars = 2; // Poor: ≤5 hours
    } else {
      stars = 1; // Very poor: >5 hours
    }

    return stars;
  });

  const totalStars = responseTimeScores.reduce((sum, stars) => sum + stars, 0);

  return respondedRequests.length > 0
    ? totalStars / respondedRequests.length
    : 0;
};

/**
 * Calculate average request acceptance rate based on acceptance vs rejection
 * Reputation is based on: (accepted + completed) / (accepted + rejected + completed)
 * Only considers requests that have been responded to (accepted, rejected, or completed)
 * Completed requests count as accepted since they were originally accepted
 * @param {Array} requests - Array of service request objects
 * @returns {number} Acceptance rate between 0 and 1
 */
export const calculateAvgRequestAcceptanceRate = (requests) => {
  if (!requests || requests.length === 0) {
    return 0;
  }

  // Only consider requests that have been responded to (accepted, rejected, or completed)
  // Completed requests count as accepted for reputation calculation
  const respondedRequests = requests.filter(
    (request) =>
      request.status === "accepted" ||
      request.status === "rejected" ||
      request.status === "completed"
  );

  if (respondedRequests.length === 0) {
    return 0;
  }

  // Count accepted and completed as accepted, rejected as rejected
  const acceptedCount = respondedRequests.filter(
    (request) => request.status === "accepted" || request.status === "completed"
  ).length;

  // Total responded requests (accepted + rejected + completed)
  const totalResponded = respondedRequests.length;

  // Calculate acceptance rate: (accepted + completed) / (accepted + rejected + completed)
  const acceptanceRate = acceptedCount / totalResponded;

  return acceptanceRate;
};

/**
 * Calculate overall rating as average of available metrics
 * @param {Object} ratings - Object containing avgReviewRating, avgResponseTime, avgRequestAcceptanceRate
 * @returns {number} Overall rating between 0 and 5
 */
export const calculateOverallRating = (ratings) => {
  const { avgReviewRating, avgResponseTime, avgRequestAcceptanceRate } =
    ratings;
  const availableRatings = [];

  // Only include ratings that have been calculated (not null/undefined)
  // Include 0 values as they represent valid calculated ratings
  if (avgReviewRating !== null && avgReviewRating !== undefined && !isNaN(avgReviewRating)) {
    availableRatings.push(avgReviewRating);
  }
  // Include response time if it's a valid number (including 0)
  if (avgResponseTime !== null && avgResponseTime !== undefined && !isNaN(avgResponseTime)) {
    availableRatings.push(avgResponseTime);
  }
  // Include acceptance rate if it's a valid number (including 0)
  if (
    avgRequestAcceptanceRate !== null &&
    avgRequestAcceptanceRate !== undefined &&
    !isNaN(avgRequestAcceptanceRate)
  ) {
    // avgRequestAcceptanceRate is now stored in 0-5 scale (from counters)
    // If it's from requests calculation (0-1 scale), normalize it; otherwise use as-is
    const normalizedAcceptanceRate = avgRequestAcceptanceRate <= 1 
      ? Math.max(1, Math.min(5, avgRequestAcceptanceRate * 5)) // Normalize 0-1 to 1-5
      : Math.max(0, Math.min(5, avgRequestAcceptanceRate)); // Already 0-5 scale, just clamp
    availableRatings.push(normalizedAcceptanceRate);
  }

  if (availableRatings.length === 0) {
    return 0;
  }

  return (
    availableRatings.reduce((sum, rating) => sum + rating, 0) /
    availableRatings.length
  );
};

/**
 * Update provider ratings based on trigger flags
 * @param {Object} provider - Provider object with reviews, requests, and rating flags
 * @returns {Object} Updated provider object with new ratings
 */
export const updateProviderRatings = (provider) => {
  const {
    reviews = [],
    requests = [],
    newReviewAdded = false,
    newRequestResponseAdded = false,
    newStatusChange = false,
  } = provider;

  let ratingsUpdated = false;
  const updatedProvider = { ...provider };

  // Update avgRating if new review was added
  if (newReviewAdded) {
    updatedProvider.avgRating = calculateAvgRating(reviews);
    ratingsUpdated = true;
  }

  // Update avgResponsiveness if new request response was added
  if (newRequestResponseAdded) {
    updatedProvider.avgResponsiveness = calculateAvgResponsiveness(requests);
    ratingsUpdated = true;
  }

  // Update avgReputation if status changed
  if (newStatusChange) {
    updatedProvider.avgReputation = calculateAvgReputation(requests);
    ratingsUpdated = true;
  }

  // Recalculate overallRating if any rating was updated
  if (ratingsUpdated) {
    updatedProvider.overallRating = calculateOverallRating({
      avgRating: updatedProvider.avgRating,
      avgResponsiveness: updatedProvider.avgResponsiveness,
      avgReputation: updatedProvider.avgReputation,
    });
  }

  // Reset flags after processing
  updatedProvider.newReviewAdded = false;
  updatedProvider.newRequestResponseAdded = false;
  updatedProvider.newStatusChange = false;

  return updatedProvider;
};

/**
 * Update only review-related ratings (avgReviewRating and overallRating)
 * This function is used when a new review is added
 * @param {Object} provider - Provider object with reviews and existing ratings
 * @returns {Object} Updated provider object with new review ratings
 */
export const updateReviewRatings = (provider) => {
  const { reviews = [] } = provider;

  // Get existing ratings that should not change
  const existingAvgResponseTime = provider.avgResponseTime || 0;
  const existingAvgRequestAcceptanceRate =
    provider.avgRequestAcceptanceRate || 0;

  // Calculate new review rating
  const newAvgReviewRating = calculateAvgRating(reviews);

  // Calculate new overall rating including existing response time and acceptance rate
  const newOverallRating = calculateOverallRating({
    avgReviewRating: newAvgReviewRating,
    avgResponseTime: existingAvgResponseTime,
    avgRequestAcceptanceRate: existingAvgRequestAcceptanceRate,
  });

  return {
    ...provider,
    avgReviewRating: newAvgReviewRating,
    overallRating: newOverallRating,
  };
};

/**
 * Update service request related ratings (avgResponseTime, avgRequestAcceptanceRate, and overallRating)
 * This function is used when service request status changes
 * @param {Object} provider - Provider object with requests and existing ratings
 * @returns {Object} Updated provider object with new service request ratings
 */
export const updateServiceRequestRatings = (provider) => {
  const { requests = [] } = provider;

  // Get existing ratings that should not change
  const existingAvgReviewRating = provider.avgReviewRating || 0;

  // Calculate new service request ratings
  const newAvgResponseTime = calculateAvgResponseTime(requests);
  
  // Use provided avgRequestAcceptanceRate if explicitly set (e.g., from counter-based calculation)
  // Otherwise calculate it from requests
  // Note: We check if it's explicitly provided as a property, not just if it's truthy (0 is valid)
  const newAvgRequestAcceptanceRate = 
    'avgRequestAcceptanceRate' in provider && provider.avgRequestAcceptanceRate !== undefined
      ? provider.avgRequestAcceptanceRate
      : calculateAvgRequestAcceptanceRate(requests);

  // Calculate new overall rating including existing review rating
  const newOverallRating = calculateOverallRating({
    avgReviewRating: existingAvgReviewRating,
    avgResponseTime: newAvgResponseTime,
    avgRequestAcceptanceRate: newAvgRequestAcceptanceRate,
  });

  return {
    ...provider,
    avgResponseTime: newAvgResponseTime,
    avgRequestAcceptanceRate: newAvgRequestAcceptanceRate,
    overallRating: newOverallRating,
  };
};

/**
 * Calculate and return all ratings for a provider
 * @param {Object} provider - Provider object with reviews and requests
 * @returns {Object} Object containing all calculated ratings
 */
export const calculateAllRatings = (provider) => {
  const { reviews = [], requests = [] } = provider;

  const avgReviewRating = calculateAvgRating(reviews);
  const avgResponseTime = calculateAvgResponseTime(requests);
  const avgRequestAcceptanceRate = calculateAvgRequestAcceptanceRate(requests);
  const overallRating = calculateOverallRating({
    avgReviewRating,
    avgResponseTime,
    avgRequestAcceptanceRate,
  });

  return {
    avgReviewRating,
    avgResponseTime,
    avgRequestAcceptanceRate,
    overallRating,
  };
};
