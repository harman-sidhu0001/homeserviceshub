import { axiosClient } from "../utils/axiosClient";

// User Authentication
export const loginUser = (data) => axiosClient.post("/auth/login/user", data);
export const registerUser = (data) =>
  axiosClient.post("/auth/register/user", data);

// Provider Authentication
export const loginProvider = (data) =>
  axiosClient.post("/auth/login/provider", data);
export const registerProvider = (data) =>
  axiosClient.post("/auth/register/provider", data);

// General Authentication
export const checkAuthStatus = () => axiosClient.get("/auth/status");
export const logoutUser = () => axiosClient.post("/auth/logout");
export const refreshAccessToken = () => axiosClient.post("/auth/refresh");

export const sendRegistrationOtp = (email, userType = "user") =>
  axiosClient.post("/auth/send-registration-otp", { email, userType });
export const verifyRegistrationOtp = (email, otp) =>
  axiosClient.post("/auth/verify-registration-otp", { email, otp });
