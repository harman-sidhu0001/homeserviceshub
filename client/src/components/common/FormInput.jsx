import { motion } from "framer-motion";
import React from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";

const FormInput = React.forwardRef(
  (
    {
      as: Component = "input",
      type = "text",
      placeholder,
      error,
      className = "",
      inputClassName = "",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <motion.div
        className={`relative ${className}`}
        animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Component
          ref={ref} // ✅ this is critical for react-hook-form
          type={Component === "input" ? inputType : undefined}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-0 focus:border-primary focus:shadow-[0_0_20px_rgba(45,90,69,0.3)]  focus:border-transparent focus-visible:outline-none transition-all
          ${error ? "border-error" : "border-accent"}
          ${Component === "textarea" ? "resize-y" : ""} ${inputClassName}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
          </button>
        )}
        {error && (
          <p
            id={`${props.id}-error`}
            className="mt-1 text-sm text-error"
            role="alert"
          >
            {error}
          </p>
        )}
      </motion.div>
    );
  }
);

export default FormInput;
