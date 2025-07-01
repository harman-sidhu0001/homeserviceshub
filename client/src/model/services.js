import { axiosClient } from "../utils/axiosClient";

export const getServices = () => axiosClient.get("/services");
