import { motion } from "framer-motion";
import Card from "../../components/common/Card";
import { useTrendingServicesViewModel } from "../../viewModel/trendingServicesViewModel";

const TrendingServices = () => {
  const { trendingServices, loading, error } = useTrendingServicesViewModel();

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Trending Services
        </h2>
        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!loading &&
            !error &&
            trendingServices.map((service, index) => (
              <motion.div
                key={service._id || service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  title={service.name}
                  description={service.description}
                  image={service.url}
                  action={{
                    children: "Book Now",
                    href: `/service?q=${service.name.toLowerCase()}&city=amritsar&sortBy=reviews`,
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
