import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { IoClose } from "react-icons/io5";
import { useAuthForm } from "../../viewModel/authViewModel";
import FormInput from "../../components/common/FormInput";
import CustomButton from "../../components/common/Button";

const ProviderLoginForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, errors, onSubmit, loading, error, setError } =
    useAuthForm("login", "provider");

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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Provider Login
          </h1>
          <p className="text-gray-600 mb-6">Access your provider dashboard.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              type="tel"
              placeholder="Company Phone Number"
              {...register("phone")}
              error={errors.phone?.message}
              autoFocus
            />
            <FormInput
              type="password"
              placeholder="Password"
              {...register("password")}
              error={errors.password?.message}
            />
            <CustomButton
              type="submit"
              text={loading ? "Logging in..." : "Log In"}
              height="auto"
              disabled={loading}
            />
            <p className="text-sm text-accent mt-2">
              Don't have a provider account?{" "}
              <Link
                to="/provider-register"
                className="text-primary hover:underline"
              >
                Register here
              </Link>
            </p>
            <p className="text-sm text-accent mt-2">
              Are you a customer?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Customer Login
              </Link>
            </p>
          </form>
        </div>
        <div className="hidden md:block w-1/2 relative">
          <LazyLoadImage
            src="/assets/images/provider1.jpg"
            alt="Provider Login Visual"
            className="w-full h-full object-cover rounded-r-2xl"
          />
          <div className="absolute inset-0 bg-black/30 rounded-r-2xl" />
          <div className="absolute inset-0 flex items-center justify-center text-white text-center p-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Join Our Network</h2>
              <p className="text-lg">
                Connect with customers and grow your business
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ProviderLoginForm;
