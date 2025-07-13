import { axiosClient } from "../utils/axiosClient";

export const getProviderReviews = (providerId) =>
  axiosClient.get(`/reviews?providerId=${providerId}`);

export const createReview = (data) => axiosClient.post("/reviews", data);

export const getUserReviews = (userId) =>
  axiosClient.get(`/reviews/user/${userId}`);
