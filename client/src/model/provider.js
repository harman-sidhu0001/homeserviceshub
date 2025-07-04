import { axiosClient } from "../utils/axiosClient";

export const getProviderById = (id) => axiosClient.get(`/providers/${id}`);

export const userSchema = {
  id: "",
  name: "",
  email: "",
  role: "provider",
};
