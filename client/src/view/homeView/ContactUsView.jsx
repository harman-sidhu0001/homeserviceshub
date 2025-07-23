import React from "react";
import { FaPhoneAlt, FaEnvelope, FaUserTie } from "react-icons/fa";
import { motion } from "framer-motion";

const contactCards = [
  {
    icon: <FaEnvelope className="text-primary text-3xl mb-3" />,
    title: "Seamless Support for You",
    text: (
      <>
        Contact us effortlessly via email at{" "}
        <a
          href="mailto:homeserviceshub1@gmail.com"
          className="underline font-semibold"
        >
          homeserviceshub1@gmail.com
        </a>
        , and experience our swift response and dedicated assistance. For
        immediate help, dial{" "}
        <a href="tel:8054875055" className="underline font-semibold">
          80548-75055
        </a>{" "}
        to connect with our friendly team. At HomeservicesHub, we value your
        time and prioritize your satisfaction. Let us be your reliable point of
        contact.
      </>
    ),
  },
  {
    icon: <FaUserTie className="text-primary text-3xl mb-3" />,
    title: "Ace's Support",
    text: (
      <>
        If you are an Ace of our company, you can count on personalized
        assistance by reaching out to us at{" "}
        <a
          href="mailto:service.homeserviceshub1@gmail.com"
          className="underline font-semibold"
        >
          service.homeserviceshub1@gmail.com
        </a>
        . Your needs are our top priority, and we're delighted to offer you our
        expertise and support. For urgent matters, don't hesitate to give us a
        call directly at{" "}
        <a href="tel:8054875055" className="underline font-semibold">
          80548-75055
        </a>
        . We're here to ensure that you receive swift and efficient solutions
        whenever you require them.
      </>
    ),
  },
  {
    icon: <FaPhoneAlt className="text-primary text-3xl mb-3" />,
    title: "Always Here for You: Our Unwavering Commitment",
    text: (
      <>
        We pride ourselves on being available to assist you whenever you need
        our support. In the unlikely event that we miss your inquiry, rest
        assured, we will promptly respond as soon as possible. Your satisfaction
        is our driving force, and we are dedicated to going the extra mile to
        exceed your expectations. Let us be your trusted partner in making your
        dreams a reality.
      </>
    ),
  },
];

const ContactUsView = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center py-16 px-4 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="/assets/images/hero-bg.jpg"
          alt="Contact background"
          className="w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-white/30 to-secondary/60 backdrop-blur-md" />
      </div>
      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white drop-shadow-lg mb-12">
          Contact Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactCards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
              className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center border border-white/20 hover:scale-105 transition-transform duration-300"
            >
              {card.icon}
              <h3 className="text-xl font-bold text-primary mb-3 drop-shadow-sm">
                {card.title}
              </h3>
              <p className="text-gray-700 text-base leading-relaxed">
                {card.text}
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

export default ContactUsView;
