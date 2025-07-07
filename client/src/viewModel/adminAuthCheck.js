import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleAsync } from "../utils/handleAsync";
import { login, logout } from "../store/authSlice";
import { getAdminStats } from "../model/admin";

export const useAdminAuthCheck = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only check if not already admin
    if (!user || role !== "admin") {
      // Try to fetch admin stats as a way to check admin session
      handleAsync(getAdminStats).then(({ success, data }) => {
        if (success && data?.data) {
          // If stats load, assume admin session is valid
          dispatch(login({ user: { ...user, accountType: "admin" } }));
        } else {
          dispatch(logout());
          navigate("/admin/login", { replace: true });
        }
      });
    }
  }, [user, role, dispatch, navigate]);

  return { user, role, loading };
};
