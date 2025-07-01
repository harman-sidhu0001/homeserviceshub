import { motion } from "framer-motion";

function CustomButton({
  type = "button",
  text,
  customClass = "",
  onClick,
  width,
  height,
  background,
  color,
  disabled,
  onSubmit,
}) {
  return (
    <motion.button
      type={type}
      className={`border border-primary text-primary bg-transparent min-w-max px-3.5 py-1.5 text-base hover:bg-primary hover:text-white hover:border-primary font-semibold rounded-md transition-all duration-200  focus:bg-primary focus:text-white focus:border-primary focus:outline-none disabled:opacity-75 disabled:cursor-not-allowed md:w-full md:h-full cursor-pointer ${customClass}`}
      style={{ width, height, backgroundColor: background, color }}
      onClick={onClick}
      onSubmit={onSubmit}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      aria-disabled={disabled}
    >
      {text}
    </motion.button>
  );
}

export default CustomButton;
