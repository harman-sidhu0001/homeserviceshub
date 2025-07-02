import { axiosClient } from "../utils/axiosClient";

export const getProviders = (params) =>
  axiosClient.get("/providers", { params });
