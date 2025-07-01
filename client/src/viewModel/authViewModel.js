import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { login, logout } from "../store/authSlice";
import {
  loginUser,
  registerUser,
  loginProvider,
  registerProvider,
  checkAuthStatus,
} from "../model/auth";
import {
  loginSchema,
  registerSchema,
  providerLoginSchema,
  providerRegisterSchema,
} from "../model/validation";
import { recoverSessionWithRefresh } from "../utils/RecoverSessionWithRefresh.js";
import { handleAsync } from "../utils/handleAsync";

export const useAuthForm = (mode = "login", userType = "user") => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);

  const serviceOptions = [
    "Plumbing",
    "Electrical",
    "Cleaning",
    "Carpentry",
    "Painting",
    "HVAC",
    "Landscaping",
    "Appliance Repair",
    "Handyman",
    "Moving",
  ];

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };
  const schema =
    userType === "provider"
      ? mode === "login"
        ? providerLoginSchema
        : providerRegisterSchema
      : mode === "login"
      ? loginSchema
      : registerSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const submitLogic = async (data) => {
    if (
      userType === "provider" &&
      mode === "register" &&
      selectedServices.length === 0
    ) {
      throw new Error("Please select at least one service");
    }

    const payload = {
      ...data,
      email: data.email?.toLowerCase(),
      location: data.location?.toLowerCase(),
      services: userType === "provider" ? selectedServices : undefined,
    };

    let res;
    if (userType === "provider") {
      res =
        mode === "login"
          ? await loginProvider(payload)
          : await registerProvider(payload);
    } else {
      res =
        mode === "login"
          ? await loginUser(payload)
          : await registerUser(payload);
    }

    if (res?.data?.user) {
      dispatch(login({ user: res.data.user }));
      navigate(userType === "provider" ? "/provider-dashboard" : "/");
    }

    reset();
    setSelectedServices([]);
  };

  const onSubmit = async (data) => {
    console.log(userType, mode);
    setLoading(true);
    await handleAsync(() => submitLogic(data), {
      onError: (err) => {
        const message =
          err?.response?.data?.message ||
          err.message ||
          `${mode === "login" ? "Login" : "Registration"} failed.`;
        setError(message);
      },
      onFinally: () => setLoading(false),
    });
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    loading,
    error,
    setError,
    serviceOptions,
    selectedServices,
    toggleService,
  };
};

export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    handleAsync(
      async () => {
        const res = await checkAuthStatus();
        if (res?.data?.user) {
          dispatch(login({ user: res.data.user }));
        } else {
          dispatch(logout());
        }
      },
      {
        onError: async (err) => {
          if (err?.response?.status === 401) {
            await recoverSessionWithRefresh(dispatch);
          } else {
            dispatch(logout());
          }
        },
        onFinally: () => setIsLoading(false),
      }
    );
  }, [dispatch]);

  return { isLoading };
};

export const useAuthLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await handleAsync(
      async () => {
        const { logoutUser } = await import("../model/auth");
        await logoutUser();
        dispatch(logout());
        navigate("/");
      },
      {
        onError: (err) => {
          console.error("Logout error:", err);
          dispatch(logout());
          navigate("/");
        },
        onFinally: () => setLoading(false),
      }
    );
  };

  return { handleLogout, loading };
};
