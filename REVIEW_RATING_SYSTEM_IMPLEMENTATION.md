# Review Rating System Implementation

## Overview

This document describes the implementation of the review rating system that automatically updates provider ratings when new reviews are created.

## Key Features

1. **Automatic Rating Updates**: When a new review is created, the system automatically:

   - Increments the total review count by 1
   - Recalculates the average review rating
   - Updates the overall rating (preserving existing responsiveness and reputation)

2. **Consistent Rating Scale**: All ratings are on a 0-5 scale for consistency

3. **Multiple Rating Metrics**: The system tracks:

   - `avgReviewRating`: Average of all user review stars (0-5)
   - `avgResponseTime`: Based on response times to service requests (0-5)
   - `avgRequestAcceptanceRate`: Based on request acceptance rate (0-5)
   - `overallRating`: Weighted average of all metrics (0-5)

4. **Selective Updates**:
   - **Reviews**: Only update `avgReviewRating` and `overallRating`
   - **Service Requests**: Only update `avgResponseTime` and `avgRequestAcceptanceRate`
   - **Status Changes**: Only update `avgResponseTime` and `avgRequestAcceptanceRate`

## Implementation Details

### 1. Review Creation Flow

When a new review is created via the `createReview` controller:

```javascript
// 1. Create the review
const review = new Review({
  reviewBy,
  reviewTo,
  stars,
  reviewTitle,
  reviewDescription,
});
await review.save();

// 2. Update provider ratings (review-only)
const provider = await User.findById(reviewTo);
if (provider) {
  // Get all reviews for this provider
  const allReviews = await Review.find({ reviewTo });

  // Prepare provider data with existing ratings
  const providerData = {
    ...provider.toObject(),
    reviews: allReviews,
    avgResponseTime: provider.providerProfile?.avgResponseTime || 0,
    avgRequestAcceptanceRate:
      provider.providerProfile?.avgRequestAcceptanceRate || 0,
  };

  // Calculate updated review ratings only (preserves response time and acceptance rate)
  const ratingsUpdated = updateReviewRatings(providerData);

  // Update provider with new review ratings
  await User.findByIdAndUpdate(reviewTo, {
    "providerProfile.avgReviewRating": ratingsUpdated.avgReviewRating,
    "providerProfile.overallRating": ratingsUpdated.overallRating,
    "providerProfile.totalReviews": allReviews.length,
  });
}
```

### 2. Rating Calculation Functions

#### `calculateAvgRating(reviews)`

- Calculates average rating from review stars
- Returns value between 0-5
- Formula: `totalStars / numberOfReviews`

#### `calculateAvgResponseTime(requests)`

- Based on response times to service requests
- Uses `createdAt` and `responseTime` fields from ServiceRequest model
- Includes accepted, rejected, and completed requests (all have response times)
- Completed requests retain their original response time from when they were accepted
- Assigns stars based on response time (1-5 scale):
  - ≤5 minutes: 5 stars (Excellent)
  - ≤15 minutes: 4 stars (Good)
  - ≤60 minutes: 3 stars (Average)
  - ≤300 minutes: 2 stars (Poor)
  - > 300 minutes: 1 star (Very poor)

#### `calculateAvgRequestAcceptanceRate(requests)`

- Based on request acceptance vs rejection (Reputation metric)
- Formula: `(accepted + completed) / (accepted + rejected + completed)`
- Only considers requests that have been responded to (accepted, rejected, or completed)
- Completed requests count as accepted since they were originally accepted
- Pending and cancelled requests are excluded from the calculation
- Returns value between 0-1 (percentage as decimal):
  - 100% acceptance = 1.0
  - 80% acceptance = 0.8
  - 60% acceptance = 0.6
  - 40% acceptance = 0.4
  - 20% acceptance = 0.2
  - 0% acceptance = 0.0
- Note: This value is normalized to 1-5 scale in `calculateOverallRating()` function

#### `calculateOverallRating(ratings)`

- Weighted average of all available metrics
- Returns value between 0 and 5
- Normalizes `avgRequestAcceptanceRate` from 0-1 scale to 1-5 scale before averaging
- Uses `avgReviewRating` and `avgResponseTime` as-is (already on 0-5 scale)

#### `updateReviewRatings(provider)`

- Updates only review-related ratings when a new review is added
- Preserves existing `avgResponseTime` and `avgRequestAcceptanceRate` values
- Updates `avgReviewRating` and `overallRating` only
- Used specifically for review creation

#### `updateServiceRequestRatings(provider)`

- Updates service request related ratings when status changes
- Preserves existing `avgReviewRating` (review rating)
- Updates `avgResponseTime`, `avgRequestAcceptanceRate`, and `overallRating`
- Used specifically for service request status changes

### 3. Database Schema

The User model includes these rating fields in `providerProfile`:

```javascript
providerProfile: {
  totalReviews: Number,                    // Total number of reviews
  avgReviewRating: Number,                 // Average review rating (0-5)
  avgResponseTime: Number,                 // Average response time rating (0-5)
  avgRequestAcceptanceRate: Number,        // Request acceptance rate (0-5)
  overallRating: Number,                   // Overall rating (0-5)
  // ... other fields
}
```

### 4. Service Request Status Change Flow

When a service request status changes (pending → accepted/rejected):

```javascript
// 1. Update request status and response time
request.status = status;
request.responseTime = new Date();
await request.save();

// 2. Update provider ratings (service request only)
const provider = await User.findById(request.providerId);
if (provider) {
  // Get all service requests for this provider
  const allRequests = await ServiceRequest.find({
    providerId: request.providerId,
  });

  // Prepare provider data with existing review rating
  const providerData = {
    ...provider.toObject(),
    requests: allRequests,
    avgReviewRating: provider.providerProfile?.avgReviewRating || 0,
  };

  // Calculate updated service request ratings
  const ratingsUpdated = updateServiceRequestRatings(providerData);

  // Update provider with new service request ratings
  await User.findByIdAndUpdate(request.providerId, {
    "providerProfile.avgResponseTime": ratingsUpdated.avgResponseTime,
    "providerProfile.avgRequestAcceptanceRate":
      ratingsUpdated.avgRequestAcceptanceRate,
    "providerProfile.overallRating": ratingsUpdated.overallRating,
  });
}
```

### 5. Selective Update System

The rating system uses specific functions for different actions:

- **Reviews**: `updateReviewRatings()` - Only updates `avgReviewRating` and `overallRating`
- **Service Requests**: `updateServiceRequestRatings()` - Only updates `avgResponseTime`, `avgRequestAcceptanceRate`, and `overallRating`

## API Endpoints

### Create Review

```
POST /api/reviews
Body: {
  reviewBy: "userId",
  reviewTo: "providerId",
  stars: 5,
  reviewTitle: "Great service",
  reviewDescription: "Excellent work..."
}
```

This endpoint creates a Review document and automatically updates provider ratings.

### Rate Service (Alternative Review Creation)

```
POST /api/users/service-requests/:requestId/rate
Body: {
  rating: 5,
  review: "Great service",
  serviceQuality: 5,
  professionalism: 5,
  valueForMoney: 5
}
```

This endpoint:
1. Saves the review to the ServiceRequest document
2. Creates a Review document to maintain consistency
3. Automatically updates provider ratings

### Get Provider Reviews

```
GET /api/reviews?providerId=providerId
```

## Testing

**Note:** A test script is planned but not yet implemented. Manual testing is recommended for the following scenarios:

1. **Review Creation Test:**
   - Create a review via `POST /api/reviews`
   - Verify `avgReviewRating` and `overallRating` are updated
   - Verify `totalReviews` count increments

2. **Service Request Rating Test:**
   - Accept a service request
   - Verify `avgResponseTime`, `avgRequestAcceptanceRate`, and `overallRating` are updated
   - Rate the service via `POST /api/users/service-requests/:requestId/rate`
   - Verify a Review document is created
   - Verify provider ratings are updated

3. **Service Request Status Change Test:**
   - Accept/reject a service request
   - Verify `avgResponseTime`, `avgRequestAcceptanceRate`, and `overallRating` are updated correctly
   - Complete a service request and verify ratings don't go backward
   - Verify completed requests are included in both response time and reputation calculations
   - Verify overall rating reflects all metrics properly

## Frontend Integration

The frontend displays ratings using these fields:

- `provider.data.avgReviewRating` - Average review rating
- `provider.data.overallRating` - Overall rating
- `provider.data.totalReviews` - Total review count

## Error Handling

- Validates required fields before creating reviews
- Handles database connection errors gracefully
- Provides meaningful error messages to users

## Performance Considerations

- Rating calculations are done efficiently using aggregation
- Database indexes are in place for review queries
- Rating updates are atomic operations

## Future Enhancements

1. **Weighted Reviews**: Consider review age or user credibility
2. **Rating Categories**: Separate ratings for different service types
3. **Review Moderation**: Admin approval for reviews
4. **Rating Analytics**: Detailed rating breakdowns and trends
5. **Notification System**: Alert providers when new reviews are posted

## Troubleshooting

### Common Issues

1. **Ratings not updating**: Check if trigger flags are set correctly
2. **Incorrect calculations**: Verify review data integrity
3. **Frontend not showing updates**: Ensure correct field names are used

### Debug Steps

1. Check MongoDB for review documents
2. Verify provider rating fields are updated
3. Test rating calculations manually
4. Check frontend field mappings

## Conclusion

The review rating system provides a robust, automated way to maintain accurate provider ratings. It ensures that ratings are always up-to-date and provides a fair assessment of provider performance based on multiple metrics.
