import { login, logout } from "../store/authSlice";
import { axiosClient } from "./axiosClient";

export const recoverSessionWithRefresh = async (dispatch) => {
  try {
    const refreshRes = await axiosClient.post("/auth/refresh");
    if (refreshRes?.data?.user) {
      dispatch(login({ user: refreshRes.data.user }));
    } else {
      dispatch(logout());
    }
  } catch {
    dispatch(logout());
  }
};
