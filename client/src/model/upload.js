import { axiosClient } from "../utils/axiosClient";

export const uploadProfilePhoto = (formData) =>
  axiosClient.post("/users/upload-profile-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
