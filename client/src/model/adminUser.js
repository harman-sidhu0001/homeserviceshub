import { axiosClient } from "../utils/axiosClient";

export const updateUserByAdmin = (userId, data) =>
  axiosClient.put(`/admin/user/${userId}`, data);

export const deleteUserByAdmin = (userId) =>
  axiosClient.delete(`/admin/user/${userId}`);
