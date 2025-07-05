// user.js
import { axiosClient } from "../utils/axiosClient";

// Basic user operations
export const getUserProfile = () => axiosClient.get("/users/profile");

export const updateUserProfile = (data) =>
  axiosClient.put("/users/profile", data);

// Enhanced user profile operations
export const getUserProfileDetailed = () =>
  axiosClient.get("/users/profile/detailed");

export const getUserServiceHistory = (params = {}) =>
  axiosClient.get("/users/service-history", { params });

// File upload operations
export const uploadProfilePhoto = (formData) =>
  axiosClient.post("/users/upload-profile-photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const uploadVerificationDocuments = (formData) =>
  axiosClient.post("/users/upload-verification", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Bookmark management
export const addToBookmarks = (providerId) =>
  axiosClient.post("/users/bookmarks", { providerId });

export const removeFromBookmarks = (providerId) =>
  axiosClient.delete(`/users/bookmarks/${providerId}`);

export const getUserBookmarks = () => axiosClient.get("/users/bookmarks");

// Service requests
export const listNearbyProviders = (params = {}) =>
  axiosClient.get("/users/providers/nearby", { params });

export const requestService = (data) =>
  axiosClient.post("/users/request-service", data);

export const cancelServiceRequest = (requestId) =>
  axiosClient.delete(`/users/request-service/${requestId}/cancel`);

// Rating and reviews
export const rateService = (requestId, data) =>
  axiosClient.post(`/users/service-requests/${requestId}/rate`, data);

// Analytics
export const getUserAnalytics = (params = {}) =>
  axiosClient.get("/users/analytics", { params });

export const userSchema = {
  id: "",
  name: "",
  email: "",
  role: "user",
};
