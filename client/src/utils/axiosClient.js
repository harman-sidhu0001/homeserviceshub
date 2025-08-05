import axios from "axios";
import { currentConfig } from "../config/environment.js";

export const axiosClient = axios.create({
  baseURL: currentConfig.apiBaseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for debugging
axiosClient.interceptors.request.use(
  (config) => {
    console.log(
      `🌐 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${
        config.url
      }`
    );
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axiosClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      "❌ Response Error:",
      error.response?.status,
      error.response?.data
    );
    return Promise.reject(error);
  }
);
