import axios from "axios";
import { currentConfig } from "../config/environment.js";

export const axiosClient = axios.create({
  baseURL: currentConfig.apiBaseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
