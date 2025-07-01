// This file is deprecated - use model/auth.js instead for proper MVVM pattern
// Keeping for backward compatibility but should be removed eventually
import { axiosClient } from "../utils/axiosClient";

// User Authentication
export const loginUser = (credentials) =>
  axiosClient.post("/auth/login/user", credentials);
export const registerUser = (data) =>
  axiosClient.post("/auth/register/user", data);

// Provider Authentication
export const loginProvider = (credentials) =>
  axiosClient.post("/auth/login/provider", credentials);
export const registerProvider = (data) =>
  axiosClient.post("/auth/register/provider", data);

// General Auth
export const checkAuthStatus = () => axiosClient.get("/auth/status");
export const logout = () => axiosClient.post("/auth/logout");
export const refreshToken = () => axiosClient.post("/auth/refresh");
