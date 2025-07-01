// views/auth/LoginForm.jsx
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { IoClose } from "react-icons/io5";
import { useAuthForm } from "../../viewModel/authViewModel";
import FormInput from "../../components/common/FormInput";
import CustomButton from "../../components/common/Button";

const LoginForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, errors, onSubmit } = useAuthForm("login");

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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Log In</h1>
          <p className="text-gray-600 mb-6">Access your dashboard.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              type="email"
              placeholder="Email"
              {...register("email")}
              error={errors.email?.message}
              autoFocus
            />
            <FormInput
              type="password"
              placeholder="Password"
              {...register("password")}
              error={errors.password?.message}
            />
            <CustomButton type="submit" text="Log In" height="auto" />
            <p className="text-sm text-accent mt-2">
              Don’t have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </p>
          </form>
        </div>
        <div className="hidden md:block w-1/2 relative">
          <LazyLoadImage
            src="/assets/images/defaultBG.jpg"
            alt="Login Visual"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      </div>
    </motion.section>
  );
};

export default LoginForm;
