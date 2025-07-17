import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "https://homeserviceshub-backend.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
