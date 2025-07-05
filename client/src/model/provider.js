import { axiosClient } from "../utils/axiosClient";

// Basic provider operations
export const getProviderById = (id) => axiosClient.get(`/providers/${id}`);

// Enhanced provider profile operations
export const getProviderProfile = (id) =>
  axiosClient.get(`/providers/${id}/profile`);

export const updateProviderProfile = (id, data) =>
  axiosClient.put(`/providers/${id}/profile`, data);

export const getProviderServiceRequests = (id, params = {}) =>
  axiosClient.get(`/providers/${id}/service-requests`, { params });

export const updateServiceRequestStatus = (requestId, data) =>
  axiosClient.put(`/providers/service-requests/${requestId}/status`, data);

export const getProviderAnalytics = (id, params = {}) =>
  axiosClient.get(`/providers/${id}/analytics`, { params });

// File upload operations
export const uploadProviderProfilePhoto = (formData) =>
  axiosClient.post("/providers/upload/profile-photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const uploadGalleryImage = (formData) =>
  axiosClient.post("/providers/upload/gallery-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Service providers search
export const getServiceProviders = (params = {}) =>
  axiosClient.get("/providers", { params });

export const userSchema = {
  id: "",
  name: "",
  email: "",
  role: "provider",
};
