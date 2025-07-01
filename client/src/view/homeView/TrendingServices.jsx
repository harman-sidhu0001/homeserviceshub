import { motion } from "framer-motion";
import Card from "../../components/common/Card";

const trendingServices = [
  {
    title: "AC Repair",
    description: "Stay cool with expert repairs",
    image: "/assets/images/ac-repair.webp",
  },
  {
    title: "Electrical",
    description: "Fixing all wires",
    image: "/assets/images/electrician.jpg",
  },
];

const TrendingServices = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Trending Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trendingServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                title={service.title}
                description={service.description}
                image={service.image}
                action={{
                  children: "Book Now",
                  href: `/services/${service.title.toLowerCase()}`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingServices;
