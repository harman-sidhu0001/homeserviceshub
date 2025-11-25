// views/auth/RegisterForm.jsx
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { IoClose } from "react-icons/io5";
import { useAuthForm } from "../../viewModel/authViewModel";
import FormInput from "../../components/common/FormInput";
import CustomButton from "../../components/common/Button";
import LocationSelector from "../../components/common/LocationSelector";

const RegisterForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    otp,
    setOtp,
    otpSent,
    otpVerified,
    otpLoading,
    otpError,
    handleSendOtp,
    handleVerifyOtp,
    loading,
    error,
    setValue,
  } = useAuthForm("register");

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gray-100 flex items-center justify-center px-4 relative"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col md:flex-row relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-1 right-1 md:top-2 md:right-2 text-3xl text-red-500 hover:text-gray-700 z-20"
          aria-label="Close"
        >
          <IoClose />
        </button>
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Sign Up</h1>
          <p className="text-gray-600 mb-6">Create your account.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              type="text"
              placeholder="Full name"
              {...register("fullName")}
              error={errors.fullName?.message}
            />
            <FormInput
              type="email"
              placeholder="Email"
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
              type="password"
              placeholder="Password"
              {...register("password")}
              error={errors.password?.message}
            />
            <FormInput
              type="password"
              placeholder="Confirm password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
            <FormInput
              type="tel"
              placeholder="Phone number"
              {...register("phone")}
              error={errors.phone?.message}
            />
            <LocationSelector
              setValue={setValue}
              errors={errors}
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <CustomButton
              type="submit"
              text={loading ? "Signing Up..." : "Sign Up"}
              height="auto"
              disabled={!otpVerified || loading}
            />
            <p className="text-sm text-accent mt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in here
              </Link>
            </p>
          </form>
        </div>
        <div className="hidden md:block w-1/2 relative">
          <LazyLoadImage
            src="/assets/images/defaultBG.jpg"
            alt="Register Visual"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      </div>
    </motion.section>
  );
};

export default RegisterForm;
