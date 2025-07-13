import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useRequestServiceViewModel } from "../viewModel/requestServiceViewModel";
import CustomButton from "../components/common/Button";
import FormInput from "../components/common/FormInput";
import Alert from "../components/common/Alert";

const RequestServicePage = () => {
  const { providerId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const {
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
  } = useRequestServiceViewModel(providerId);

  const stepRefs = useRef([]);

  // Scroll to current step
  useEffect(() => {
    if (stepRefs.current[currentStep]) {
      stepRefs.current[currentStep].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentStep]);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      const success = await submitRequest();
      if (success) {
        navigate(-1);
      }
    }
  };

  const steps = [
    {
      title: "Basic Details",
      description: "Fill in your contact information and select service",
    },
    {
      title: "Property Type",
      description: "Select your property type",
    },
    {
      title: "Timeline",
      description: "Choose your preferred timeline",
    },
    {
      title: "Project Details",
      description: "Describe your project requirements",
    },
  ];

  const timings = [
    {
      name: "Immediate",
      value: "immediate",
      label: "I need this done right away",
    },
    {
      name: "Within a Week",
      value: "within_a_week",
      label: "I can wait up to a week",
    },
    {
      name: "Within a Month",
      value: "within_a_month",
      label: "I can wait up to a month",
    },
    { name: "Flexible", value: "flexible", label: "I'm flexible with timing" },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert type="error" message="Please login to request a service" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Request a Service
          </h1>
          <p className="text-gray-600">
            Share your project details and we'll connect you with the right
            professional
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index <= currentStep ? "text-primary" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    index <= currentStep
                      ? "bg-primary border-primary text-white"
                      : "border-gray-300"
                  }`}
                >
                  {index < currentStep ? "✓" : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      index < currentStep ? "bg-primary" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert type="error" message={error} />
          </motion.div>
        )}

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Details */}
          {currentStep === 0 && (
            <motion.div
              key="step-1"
              ref={(el) => (stepRefs.current[0] = el)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold mb-6">{steps[0].title}</h2>
              <p className="text-gray-600 mb-6">{steps[0].description}</p>

              {/* Provider Information */}
              {provider && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        provider.providerProfile?.profilePhoto ||
                        "/assets/icons/default-profile-picture.svg"
                      }
                      alt={provider.providerProfile?.companyName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {provider.providerProfile?.companyName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {provider.providerProfile?.location}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Available Services: {services.length}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <FormInput
                  label="Full Name"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Enter your full name"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Required *
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) =>
                      setFormData({ ...formData, service: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                    required
                  >
                    <option value="">
                      Select a service from{" "}
                      {provider?.providerProfile?.companyName ||
                        "this provider"}
                    </option>
                    {services.map((service, index) => (
                      <option key={index} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                  {services.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      No services available from this provider
                    </p>
                  )}
                </div>

                <FormInput
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  required
                />

                <FormInput
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Enter your phone number"
                  required
                />

                <FormInput
                  label="Address"
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Enter your address"
                  required
                />
              </div>

              <div className="mt-8 flex justify-end">
                <CustomButton
                  text="Next"
                  onClick={handleNext}
                  disabled={loading}
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Property Type */}
          {currentStep === 1 && (
            <motion.div
              key="step-2"
              ref={(el) => (stepRefs.current[1] = el)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold mb-6">{steps[1].title}</h2>
              <p className="text-gray-600 mb-6">{steps[1].description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    formData.propertyType === "home"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, propertyType: "home" })
                  }
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 mb-4">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-full h-full"
                      >
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg">Home</h3>
                    <p className="text-gray-600 text-sm">
                      Residential property
                    </p>
                  </div>
                </div>

                <div
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    formData.propertyType === "commercial"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, propertyType: "commercial" })
                  }
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 mb-4">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-full h-full"
                      >
                        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg">Commercial</h3>
                    <p className="text-gray-600 text-sm">Business property</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <CustomButton
                  text="Previous"
                  onClick={handlePrevious}
                  customClass="bg-gray-500 hover:bg-gray-600"
                />
                <CustomButton
                  text="Next"
                  onClick={handleNext}
                  disabled={loading}
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Timeline */}
          {currentStep === 2 && (
            <motion.div
              key="step-3"
              ref={(el) => (stepRefs.current[2] = el)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold mb-6">{steps[2].title}</h2>
              <p className="text-gray-600 mb-6">{steps[2].description}</p>

              <div className="space-y-4">
                {timings.map((timing) => (
                  <div
                    key={timing.value}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      formData.timeline === timing.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, timeline: timing.value })
                    }
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="timeline"
                        value={timing.value}
                        checked={formData.timeline === timing.value}
                        onChange={() =>
                          setFormData({ ...formData, timeline: timing.value })
                        }
                        className="mr-3"
                      />
                      <div>
                        <h3 className="font-semibold">{timing.name}</h3>
                        <p className="text-gray-600 text-sm">{timing.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <CustomButton
                  text="Previous"
                  onClick={handlePrevious}
                  customClass="bg-gray-500 hover:bg-gray-600"
                />
                <CustomButton
                  text="Next"
                  onClick={handleNext}
                  disabled={loading}
                />
              </div>
            </motion.div>
          )}

          {/* Step 4: Project Details */}
          {currentStep === 3 && (
            <motion.div
              key="step-4"
              ref={(el) => (stepRefs.current[3] = el)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold mb-6">{steps[3].title}</h2>
              <p className="text-gray-600 mb-6">{steps[3].description}</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe your project requirements, specific needs, and any additional details..."
                  required
                />
              </div>

              <div className="mt-8 flex justify-between">
                <CustomButton
                  text="Previous"
                  onClick={handlePrevious}
                  customClass="bg-gray-500 hover:bg-gray-600"
                />
                <CustomButton
                  text={loading ? "Submitting..." : "Submit Request"}
                  onClick={handleSubmit}
                  disabled={loading}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RequestServicePage;
