import React from "react";
import { motion } from "framer-motion";
import { FaHandshake, FaIdCard, FaVideo, FaListUl } from "react-icons/fa";

const features = [
  {
    icon: <FaListUl className="text-primary text-3xl mb-3" />,
    title: "Provider Directory",
    text: "Browse a curated list of home service providers and connect directly for your needs.",
  },
  {
    icon: <FaIdCard className="text-primary text-3xl mb-3" />,
    title: "Multi-Step Verification",
    text: "We verify providers using ID proof (Aadhaar, PAN), GST (if available), and more.",
  },
  {
    icon: <FaVideo className="text-primary text-3xl mb-3" />,
    title: "Personal & Video Calls",
    text: "We may conduct personal or video calls with providers for added authenticity.",
  },
  {
    icon: <FaHandshake className="text-primary text-3xl mb-3" />,
    title: "Direct Connection",
    text: "HomeservicesHub connects you with providers, but does not guarantee or take responsibility for service quality.",
  },
];

const AboutUsView = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center py-16 px-4 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="/assets/images/hero-bg.jpg"
          alt="About background"
          className="w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-white/30 to-secondary/60 backdrop-blur-md" />
      </div>
      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-10 md:p-16 mb-12 text-center border border-white/20"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-6 drop-shadow-lg">
            About HomeservicesHub
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto text-justify">
            <b>HomeservicesHub</b> is a comprehensive platform designed to
            simplify the way you discover and connect with reliable home service
            professionals in your area. Whether you're looking for a plumber,
            electrician, cleaner, or any other expert, our goal is to make the
            process seamless and stress-free. We offer a thoughtfully curated
            directory that brings together a wide range of service providers,
            making it easy for you to find the right fit for your specific
            needs. To promote trust and reliability, we take provider
            verification seriously. Every professional listed on our platform
            goes through a multi-step verification process that may include ID
            checks (such as Aadhaar and PAN card), GST details when applicable,
            and direct communication through personal or video calls to better
            understand their background and expertise. By focusing on
            transparency and connection, we aim to create a space where users
            can make informed choices and build confidence in the professionals
            they hire.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.12 }}
              className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border border-white/20 hover:scale-105 transition-transform duration-300"
            >
              {feature.icon}
              <h3 className="text-xl font-bold text-primary mb-2 drop-shadow-sm">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-base leading-relaxed">
                {feature.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10" />
    </section>
  );
};

export default AboutUsView;
