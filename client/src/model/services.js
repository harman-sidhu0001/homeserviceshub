import { axiosClient } from "../utils/axiosClient";

export const getServices = async () => {
  const res = await axiosClient.get("/services");
  return res.data.data;
};
