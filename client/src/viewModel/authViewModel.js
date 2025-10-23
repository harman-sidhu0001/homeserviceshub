// ✅ Updated useAuthForm with dynamic fields, availability, paymentMethods, etc.

import { useForm, useFieldArray } from "react-hook-form";
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
  sendRegistrationOtp,
  verifyRegistrationOtp,
} from "../model/auth";
import {
  loginSchema,
  registerSchema,
  providerLoginSchema,
  providerRegisterSchema,
} from "../model/validation";
import { recoverSessionWithRefresh } from "../utils/RecoverSessionWithRefresh.js";
import { handleAsync } from "../utils/handleAsync";
import { getServices } from "../model/services.js";

export const useAuthForm = (mode = "login", userType = "user") => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  const getServicesdata = async () => {
    const { success, data } = await handleAsync(getServices);
    if (success) {
      setServiceOptions(Array.isArray(data) ? data : []);
    }
  };
  useEffect(() => {
    if (userType === "provider" && mode === "register") {
      getServicesdata();
    }
  }, []);
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
    control,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      availability: [],
      paymentMethods: [],
      serviceAreas: [],
      customFields: [{ key: "", value: "" }],
    },
  });

  const {
    fields: customFields,
    append: appendCustomField,
    remove: removeCustomField,
  } = useFieldArray({
    control,
    name: "customFields",
  });

  // Handler to send OTP
  const handleSendOtp = async () => {
    setOtpLoading(true);
    setOtpError("");
    try {
      const email = watch("email");
      if (!email || email.trim() === "") {
        setOtpError("Please enter your email first.");
        setOtpLoading(false);
        return;
      }
      await sendRegistrationOtp(email);
      setOtpSent(true);
    } catch (err) {
      setOtpError(
        err?.response?.data?.message || err?.message || "Failed to send OTP."
      );
    }
    setOtpLoading(false);
  };

  // Handler to verify OTP
  const handleVerifyOtp = async () => {
    setOtpLoading(true);
    setOtpError("");
    try {
      const email = watch("email");
      if (!email || !otp) {
        setOtpError("Please enter your email and OTP.");
        setOtpLoading(false);
        return;
      }
      await verifyRegistrationOtp(email, otp);
      setOtpVerified(true);
    } catch (err) {
      setOtpError(
        err?.response?.data?.message ||
          err?.message ||
          "OTP verification failed."
      );
      setOtpVerified(false);
    }
    setOtpLoading(false);
  };

  const submitLogic = async (data) => {
    if (
      userType === "provider" &&
      mode === "register" &&
      selectedServices.length === 0
    ) {
      throw new Error("Please select at least one service");
    }
    // OTP required only when email is provided
    const hasEmail = data.email && data.email.trim() !== "";
    if (mode === "register" && hasEmail && !otpVerified) {
      throw new Error("Please verify your email with OTP before registering.");
    }

    const payload = {
      ...data,
      email: data.email?.toLowerCase(),
      location: data.location?.toLowerCase(),
      services:
        userType === "provider" && mode === "register"
          ? selectedServices
          : undefined,
      otp: mode === "register" ? otp : undefined,
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
      if (userType === "provider" && mode === "register") {
        navigate("/loggedproviderprofile");
        window.location.reload();
      } else {
        navigate(userType === "provider" ? "/loggedproviderprofile" : "/");
      }
    }

    reset();
    setSelectedServices([]);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const { success, error } = await handleAsync(() => submitLogic(data));

    if (!success) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        `${mode === "login" ? "Login" : "Registration"} failed.`;
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
    serviceOptions,
    selectedServices,
    toggleService,
    control,
    setValue,
    watch,
    customFields,
    appendCustomField,
    removeCustomField,
    // OTP logic
    otp,
    setOtp,
    otpSent,
    otpVerified,
    otpLoading,
    otpError,
    handleSendOtp,
    handleVerifyOtp,
  };
};

export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { success, data, error } = await handleAsync(checkAuthStatus);

      if (success && data?.data?.user) {
        dispatch(login({ user: data.data.user }));
      } else if (error?.response?.status === 401) {
        await recoverSessionWithRefresh(dispatch);
      } else {
        dispatch(logout());
      }

      setIsLoading(false);
    };

    checkSession();
  }, [dispatch]);

  return { isLoading };
};

export const useAuthLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    const { success, error } = await handleAsync(async () => {
      // logoutUser is statically imported at top; call it directly
      await logoutUser();
      dispatch(logout());
      navigate("/");
    });

    if (!success) {
      console.error("Logout error:", error);
      dispatch(logout());
      navigate("/");
    }

    setLoading(false);
  };

  return { handleLogout, loading };
};
