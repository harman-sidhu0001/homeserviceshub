import { motion } from "framer-motion";
import Card from "../../components/common/Card";
import { useTopProvidersInAmritsar } from "../../viewModel/serviceProvidersViewModel";

const TopProviders = () => {
  const { providers, loading, error } = useTopProvidersInAmritsar();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Top Providers</h2>
        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {!loading &&
            !error &&
            providers.map((provider, index) => (
              <motion.div
                key={provider._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  title={provider.providerProfile.companyName}
                  description={`Amritsar • ${
                    provider.providerProfile.overallRating
                      ? (
                          Math.round(
                            provider.providerProfile.overallRating * 2
                          ) / 2
                        ).toFixed(1)
                      : "N/A"
                  } ★`}
                  image={
                    provider.providerProfile.profilePhoto
                      ? provider.providerProfile.profilePhoto
                      : "/assets/images/defaultBG.jpg"
                  }
                  action={{
                    children: "Book Now",
                    href: `/provider/${provider._id}`,
                  }}
                />
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default TopProviders;
