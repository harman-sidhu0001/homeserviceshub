// admin.js
import { axiosClient } from "../utils/axiosClient";

// Admin login
export const loginAdmin = (credentials) =>
  axiosClient.post("/admin/login", credentials);

// Admin dashboard APIs
export const getAdminStats = () => axiosClient.get("/admin/stats");

export const getAllUsers = (params = {}) =>
  axiosClient.get("/admin/users", { params });

export const getAllProviders = (params = {}) =>
  axiosClient.get("/admin/providers", { params });

export const getAllServiceRequests = (params = {}) =>
  axiosClient.get("/admin/requests", { params });

export const deactivateUser = (userId) =>
  axiosClient.put(`/admin/user/${userId}/deactivate`);

export const activateUser = (userId) =>
  axiosClient.put(`/admin/user/${userId}/activate`);

export const getTopCities = () => axiosClient.get("/admin/top-cities");

export const getWeeklyTrend = () => axiosClient.get("/admin/weekly-trend");

// Admin schema
export const adminSchema = {
  id: "",
  email: "",
  accountType: "admin",
};

export const updateUserByAdmin = (userId, data) =>
  axiosClient.put(`/admin/user/${userId}`, data);

export const deleteUserByAdmin = (userId) =>
  axiosClient.delete(`/admin/user/${userId}`);

export const updateProviderByAdmin = (providerId, data) =>
  axiosClient.put(`/admin/provider/${providerId}`, data);

export const deleteProviderByAdmin = (providerId) =>
  axiosClient.delete(`/admin/provider/${providerId}`);

export const activateProvider = (providerId) =>
  axiosClient.put(`/admin/provider/${providerId}/activate`);
