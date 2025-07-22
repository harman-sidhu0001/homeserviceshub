import { axiosClient } from "../utils/axiosClient";

export const getProviders = (params) =>
  axiosClient.get("/providers", { params });

export const getTopProvidersInAmritsar = async () => {
  const res = await axiosClient.get("/users/top-providers-amritsar");
  return res.data.data;
};
