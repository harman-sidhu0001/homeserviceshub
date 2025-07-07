import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { loginAdmin } from "../model/admin.js";
import { login, logout } from "../store/authSlice.js";
import { adminLoginSchema } from "../model/validation.js";
import { handleAsync } from "../utils/handleAsync.js";

export const useAdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    const {
      success,
      data: responseData,
      error: responseError,
    } = await handleAsync(() => loginAdmin(data));

    if (success && responseData?.data?.user) {
      // Store admin data in Redux - match the exact pattern from auth viewModel
      dispatch(login({ user: responseData.data.user }));

      // Navigate to admin dashboard
      navigate("/admin/dashboard");

      // Reset form
      reset();
    } else {
      const message =
        responseError?.response?.data?.message ||
        responseError?.message ||
        "Admin login failed.";
      setError(message);
    }

    setLoading(false);
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    loading,
    error,
    setError,
  };
};

export const useAdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    user,
    role,
    loading: authLoading,
  } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user || role !== "admin") {
        navigate("/admin/login", { replace: true });
      }
    }
  }, [user, role, authLoading, navigate]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      dispatch(logout());
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    role,
    loading: loading || authLoading,
    handleLogout,
  };
};
