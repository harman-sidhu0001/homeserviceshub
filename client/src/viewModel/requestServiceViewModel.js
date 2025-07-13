import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getProviderById } from "../model/provider";
import { requestService } from "../model/user";
import { handleAsync } from "../utils/handleAsync";

export const useRequestServiceViewModel = (providerId) => {
  const user = useSelector((state) => state.auth.user);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);

  const [formData, setFormData] = useState({
    fullName: user?.userProfile?.fullName || "",
    email: user?.userProfile?.email || "",
    phone: user?.userProfile?.phone || "",
    service: "",
    address: user?.userProfile?.location || "",
    propertyType: "",
    timeline: "",
    description: "",
  });

  // Fetch provider data on mount
  useEffect(() => {
    const fetchProvider = async () => {
      if (providerId) {
        const { success, data, error } = await handleAsync(() =>
          getProviderById(providerId)
        );
        if (success) {
          setProvider(data?.data);
          setServices(data?.data?.providerProfile?.services || []);
        } else {
          setError("Failed to load provider information");
        }
      }
    };

    fetchProvider();
  }, [providerId]);

  // Validation functions for each step
  const validateStep = (step) => {
    switch (step) {
      case 0: // Basic Details
        return (
          formData.fullName.trim() &&
          formData.email.trim() &&
          formData.phone.trim() &&
          formData.service &&
          formData.address.trim()
        );
      case 1: // Property Type
        return formData.propertyType;
      case 2: // Timeline
        return formData.timeline;
      case 3: // Project Details
        return formData.description.trim();
      default:
        return false;
    }
  };

  // Submit service request
  const submitRequest = async () => {
    if (!validateStep(currentStep)) {
      setError("Please fill in all required fields");
      return false;
    }

    setLoading(true);
    setError("");

    try {
      const requestData = {
        providerId,
        serviceName: formData.service,
        description: formData.description,
        preferredDate: new Date().toISOString(), // Use current date as default
        location: formData.address,
        budget: undefined, // Optional field
        propertyType: formData.propertyType,
        timeline: formData.timeline,
      };

      const { success, data, error } = await handleAsync(() =>
        requestService(requestData)
      );

      if (success) {
        // Reset form and show success
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          service: "",
          address: "",
          propertyType: "",
          timeline: "",
          description: "",
        });
        setCurrentStep(0);
        return true;
      } else {
        setError(error?.response?.data?.message || "Failed to submit request");
        return false;
      }
    } catch (err) {
      setError("An unexpected error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    currentStep,
    setCurrentStep,
    loading,
    error,
    provider,
    services,
    submitRequest,
    validateStep,
  };
};
