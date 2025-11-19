/**
 * Calculate star rating based on response time in minutes
 * Uses the specified scale:
 * - Less than 5 minutes → 5 stars
 * - Between 5 and 10 minutes → 4 stars
 * - Between 10 and 30 minutes → 3 stars
 * - Between 30 and 180 minutes → 2 stars
 * - More than 180 minutes → 1 star
 * @param {number} responseTimeMinutes - Response time in minutes
 * @returns {number} Star rating between 1 and 5
 */
export const calculateResponseTimeStars = (responseTimeMinutes) => {
  if (responseTimeMinutes < 5) {
    return 5;
  } else if (responseTimeMinutes < 10) {
    return 4;
  } else if (responseTimeMinutes < 30) {
    return 3;
  } else if (responseTimeMinutes < 180) {
    return 2;
  } else {
    return 1;
  }
};

/**
 * Calculate new average response time rating using running average formula
 * Formula: newAvg = ((avgRating × totalResponses) + newRating) / (totalResponses + 1)
 * @param {number} currentAvgRating - Current average rating
 * @param {number} totalResponses - Current total number of responses
 * @param {number} newRating - New rating to add
 * @returns {number} New average rating
 */
export const updateRunningAverage = (currentAvgRating, totalResponses, newRating) => {
  if (totalResponses === 0) {
    return newRating; // First response
  }
  
  const newAvg = ((currentAvgRating * totalResponses) + newRating) / (totalResponses + 1);
  return newAvg;
};

