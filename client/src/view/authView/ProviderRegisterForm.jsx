// ✅ Full MVVM-Aware Code Update for Provider Registration Form (React + React Hook Form + Zod)

import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { IoClose } from "react-icons/io5";
import FormInput from "../../components/common/FormInput";
import CustomButton from "../../components/common/Button";
import AvailabilitySelector from "../../components/common/AvailabilitySelector";
import { useAuthForm } from "../../viewModel/authViewModel";

const ProviderRegisterForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    loading,
    error,
    serviceOptions,
    selectedServices,
    toggleService,
    watch,
    otp,
    setOtp,
    otpSent,
    otpVerified,
    otpLoading,
    otpError,
    handleSendOtp,
    handleVerifyOtp,
  } = useAuthForm("register", "provider");

  // Remove the old availability days array since we're using the new component
  const paymentOptions = ["Cash", "UPI", "Card"];
  const serviceAreas = ["Amritsar"];
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gray-100 flex items-center justify-center px-4 relative py-8"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl flex flex-col md:flex-row relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-1 right-1 md:top-2 md:right-2 text-3xl text-red-500 hover:text-gray-700 z-20"
          aria-label="Close"
        >
          <IoClose />
        </button>

        <div className="w-full md:w-1/2 p-6 md:p-8 max-h-screen overflow-y-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Provider Registration
          </h1>
          <p className="text-gray-600 mb-6">
            Join our network of service providers.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              type="text"
              placeholder="Company Name"
              {...register("companyName")}
              error={errors.companyName?.message}
              autoFocus
            />

            <FormInput
              type="email"
              placeholder="Email (Optional)"
              {...register("email")}
              error={errors.email?.message}
            />
            {/* OTP Section */}
            <div className="flex gap-2 items-center">
              {!otpVerified && (
                <CustomButton
                  type="button"
                  text={otpSent ? "Resend OTP" : "Send OTP"}
                  onClick={handleSendOtp}
                  disabled={otpLoading}
                  width="auto"
                />
              )}
              {otpSent && !otpVerified && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="border rounded px-2 py-1 w-32"
                  />
                  <CustomButton
                    type="button"
                    text="Verify OTP"
                    onClick={handleVerifyOtp}
                    disabled={otpLoading || !otp}
                    width="auto"
                  />
                </>
              )}
              {otpVerified && (
                <span className="text-green-600 font-semibold ml-2">
                  Email Verified
                </span>
              )}
            </div>
            {otpError && <div className="text-red-500 text-sm">{otpError}</div>}

            <FormInput
              type="tel"
              placeholder="Company Phone Number"
              {...register("phone")}
              autoComplete="number"
              error={errors.phone?.message}
            />

            <FormInput
              type="password"
              placeholder="Password"
              {...register("password")}
              autoComplete="new-password"
              error={errors.password?.message}
            />

            <FormInput
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
            />

            {/* Availability Days */}
            <AvailabilitySelector
              value={watch("availability") || []}
              onChange={(selectedDays) => {
                // Update the form value
                const event = {
                  target: {
                    name: "availability",
                    value: selectedDays,
                  },
                };
                register("availability").onChange(event);
              }}
              required={true}
              label="Availability"
            />
            {errors.availability && (
              <p className="text-red-500 text-sm mt-1">
                {errors.availability.message}
              </p>
            )}

            {/* Year Established */}
            <FormInput
              type="number"
              placeholder="Year of Establishment"
              {...register("yearEstablished")}
              error={errors.yearEstablished?.message}
            />

            {/* Payment Methods */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Methods
              </label>
              <div className="flex gap-4 flex-wrap">
                {paymentOptions.map((method) => (
                  <label key={method} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={method}
                      {...register("paymentMethods")}
                    />
                    <span>{method}</span>
                  </label>
                ))}
              </div>
              {errors.paymentMethods && (
                <p className="text-red-500 text-sm">
                  {errors.paymentMethods.message}
                </p>
              )}
            </div>

            {/* Service Areas */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Service Areas
              </label>
              <div className="border rounded p-2">
                {serviceAreas.map((area) => (
                  <label key={area} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={area}
                      {...register("serviceAreas")}
                    />
                    <span>{area}</span>
                  </label>
                ))}
              </div>
              {errors.serviceAreas && (
                <p className="text-red-500 text-sm">
                  {errors.serviceAreas.message}
                </p>
              )}
            </div>

            {/* Services */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Services Offered (Select at least one)
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-3">
                {serviceOptions.map((service, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.name)}
                      onChange={() => toggleService(service.name)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{service.name}</span>
                  </label>
                ))}
              </div>
              {selectedServices.length === 0 && (
                <p className="text-red-500 text-sm">
                  Please select at least one service
                </p>
              )}
            </div>

            {/* Dynamic Fields */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700">
                Optional Custom Details
              </label>
              {customFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center mb-2">
                  <input
                    placeholder="Key"
                    {...register(`customFields.${index}.key`)}
                    className="flex-1 border rounded p-1"
                  />
                  <input
                    placeholder="Value"
                    {...register(`customFields.${index}.value`)}
                    className="flex-1 border rounded p-1"
                  />
                  <button
                    type="button"
                    className="text-red-600 text-lg"
                    onClick={() => removeCustomField(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
              {customFields.length < 5 && (
                <button
                  type="button"
                  onClick={() => appendCustomField({ key: "", value: "" })}
                  className="text-primary underline text-sm"
                >
                  + Add Custom Field
                </button>
              )}
            </div> */}

            <FormInput
              type="text"
              placeholder="Company Location"
              {...register("location")}
              error={errors.location?.message}
            />

            <FormInput
              type="number"
              placeholder="Total Workers"
              {...register("totalWorkers", { valueAsNumber: true })}
              error={errors.totalWorkers?.message}
            />

            <CustomButton
              type="submit"
              text={loading ? "Registering..." : "Register"}
              height="auto"
              disabled={loading || !otpVerified}
            />

            <p className="text-sm text-accent mt-2">
              Already have a provider account?{" "}
              <Link
                to="/provider-login"
                className="text-primary hover:underline"
              >
                Login here
              </Link>
            </p>

            <p className="text-sm text-accent mt-2">
              Are you a customer?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Customer Registration
              </Link>
            </p>
          </form>
        </div>

        <div className="hidden md:block w-1/2 relative">
          <LazyLoadImage
            src="/assets/images/defaultBG.jpg"
            alt="Provider Registration Visual"
            className="w-full h-full object-cover rounded-r-2xl"
          />
          <div className="absolute inset-0 bg-black/30 rounded-r-2xl" />
          <div className="absolute inset-0 flex items-center justify-center text-white text-center p-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Grow Your Business</h2>
              <p className="text-lg">
                Join thousands of providers already serving customers
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ProviderRegisterForm;
