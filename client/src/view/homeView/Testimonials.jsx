import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";

const testimonials = [
  {
    name: "Alice Brown",
    quote: "Amazing service! Found a plumber in minutes.",
    rating: 5,
    image: "/assets/icons/default-profile-picture.svg", // Replace with your image path
  },
  {
    name: "Bob Wilson",
    quote: "Reliable and professional providers.",
    rating: 4.8,
    image: "/assets/icons/default-profile-picture.svg",
  },
];

const Testimonials = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-extrabold text-center text-primary mb-12">
        What Our Customers Say
      </h2>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className="bg-white p-8 rounded-2xl shadow-lg flex-1 max-w-md mx-auto relative"
          >
            {/* Quote Icon */}
            <FaQuoteLeft className="text-primary text-3xl absolute -top-4 left-4 bg-white p-1 " />

            {/* User Image */}
            <div className="flex items-center mb-4">
              <LazyLoadImage
                src={testimonial.image}
                alt={testimonial.name}
                className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-primary"
                placeholderSrc="/assets/images/user-placeholder.png"
              />
              <div>
                <h4 className="font-bold text-lg text-gray-800">
                  {testimonial.name}
                </h4>
                <p className="text-primary font-medium text-sm">
                  {testimonial.rating} ★
                </p>
              </div>
            </div>

            {/* Quote Text */}
            <p className="text-gray-600 leading-relaxed italic">
              "{testimonial.quote}"
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
