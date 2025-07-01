import { motion } from "framer-motion";
import CustomButton from "../../components/common/Button";

const AreYouProvider = () => (
  <motion.section
    initial={{ opacity: 0, scale: 0.98 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="relative py-16 md:py-16 text-white overflow-hidden"
    style={{
      backgroundImage: "url('/assets/backgrounds/service-provider.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* Dark overlay */}
    <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" />

    {/* Content */}
    <div className="relative z-10 container mx-auto px-6 text-center">
      <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-md">
        Are You a Service Provider?
      </h2>
      <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-sm">
        Join <span className="text-primary font-bold">HomeServicesHub</span> and
        grow your business with verified leads and seamless tools.
      </p>
      <CustomButton
        text="Become a Provider"
        width="auto"
        className="text-lg px-8 py-3 bg-primary text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
      />
    </div>
  </motion.section>
);

export default AreYouProvider;
