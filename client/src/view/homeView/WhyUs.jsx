import { motion } from "framer-motion";
import { MdVerifiedUser, MdHeadsetMic, MdTouchApp } from "react-icons/md";

const usps = [
  {
    title: "Vetted Providers",
    description: "All providers with verified tick are verified.",
    icon: MdVerifiedUser,
  },
  {
    title: "24/7 Support",
    description: "Get help anytime you need it.",
    icon: MdHeadsetMic,
  },
  {
    title: "Easy Booking",
    description: "Book services in just a few clicks.",
    icon: MdTouchApp,
  },
];

const WhyUs = () => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        {usps.map((usp, index) => {
          const Icon = usp.icon;
          return (
            <motion.div
              key={usp.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              {/* Icon in circular primary background */}
              <div className="w-20 h-20 flex items-center justify-center bg-primary text-white rounded-full mb-4 shadow-md transition-transform hover:scale-105">
                <Icon size={36} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{usp.title}</h3>
              <p className="text-accent text-base">{usp.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default WhyUs;
