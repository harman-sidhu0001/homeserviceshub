import React from "react";
import { useAdminLogin } from "../../viewModel/adminViewModel.js";
import FormInput from "../../components/common/FormInput.jsx";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/common/Button";
import { LazyLoadImage } from "react-lazy-load-image-component";

const AdminLoginView = () => {
  const { register, handleSubmit, errors, onSubmit, loading, error } =
    useAdminLogin();
  const navigate = useNavigate();

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
        <div className="w-full p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Admin Login</h1>
          <p className="text-gray-600 mb-6">Access admin dashboard.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              type="email"
              placeholder="admin@example.com"
              {...register("email")}
              error={errors.email?.message}
              autoFocus
            />
            <FormInput
              type="password"
              placeholder="Password"
              {...register("password")}
              autoComplete="current-password"
              error={errors.password?.message}
            />
            <CustomButton
              type="submit"
              text={loading ? "Signing in..." : "Sign In"}
              height="auto"
              disabled={loading}
            />
          </form>
        </div>
      </div>
    </motion.section>
  );
};

export default AdminLoginView;
