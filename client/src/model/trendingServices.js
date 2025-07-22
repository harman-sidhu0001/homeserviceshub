import { axiosClient } from "../utils/axiosClient";

export const getTrendingServices = async () => {
  const res = await axiosClient.get("/services/trending");
  return res.data.data;
};

// Admin CRUD
export const getAllTrendingServices = async () => {
  const res = await axiosClient.get("/services/trending-services");
  return res.data.data;
};

export const getTrendingServiceById = async (id) => {
  const res = await axiosClient.get(`/services/trending-services/${id}`);
  return res.data.data;
};

export const createTrendingService = async (data) => {
  const res = await axiosClient.post("/services/trending-services", data);
  return res.data.data;
};

export const updateTrendingService = async (id, data) => {
  const res = await axiosClient.put(`/services/trending-services/${id}`, data);
  return res.data.data;
};

export const deleteTrendingService = async (id) => {
  const res = await axiosClient.delete(`/services/trending-services/${id}`);
  return res.data;
};
