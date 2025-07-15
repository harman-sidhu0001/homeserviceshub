import { axiosClient } from "../utils/axiosClient";

export const deleteGalleryImage = (imageUrl) =>
  axiosClient.delete("/providers/gallery-image", { data: { imageUrl } });
