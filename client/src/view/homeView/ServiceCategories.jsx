import { motion } from "framer-motion";
import Card from "../../components/common/Card";

const categories = [
  {
    title: "Plumber",
    description: "Fix leaks, install fixtures",
    image: "/assets/images/plumber.jpg",
  },
  {
    title: "Electrical",
    description: "Wiring, lighting, repairs",
    image: "/assets/images/electrician.jpg",
  },
  {
    title: "AC Repair",
    description: "Installation, service and repair services",
    image: "/assets/images/ac-repair.webp",
  },
  {
    title: "Painter",
    description: "Indoor/Outdoor painting solutions",
    image: "/assets/images/painter.png",
  },
];

const ServiceCategories = () => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              title={category.title}
              description={category.description}
              image={category.image}
              action={{
                children: "Explore",
                href: `/services/${category.title.toLowerCase()}`,
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ServiceCategories;
