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

export const getTopCities = () => axiosClient.get("/admin/top-cities");

export const getWeeklyTrend = () => axiosClient.get("/admin/weekly-trend");

// Admin schema
export const adminSchema = {
  id: "",
  email: "",
  accountType: "admin",
};
