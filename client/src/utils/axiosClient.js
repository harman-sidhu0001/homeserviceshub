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
    console.log("Axios Request:", {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      withCredentials: config.withCredentials,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error("Axios Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axiosClient.interceptors.response.use(
  (response) => {
    console.log("Axios Response:", {
      status: response.status,
      url: response.config.url,
      headers: response.headers,
      cookies: document.cookie,
    });
    return response;
  },
  (error) => {
    console.error("Axios Response Error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);
