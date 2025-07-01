// import { useQuery } from "@tanstack/react-query";
// import { motion } from "framer-motion";
// import Card from "../../components/common/Card";
// import apiClient from "../../services/apiClient";

// const fetchProviders = async () => {
//   const { data } = await apiClient.get("/providers/top");
//   return data;
// };

// const TopProviders = () => {
//   const { data: providers, isLoading } = useQuery({
//     queryKey: ["topProviders"],
//     queryFn: fetchProviders,
//     placeholderData: [
//       {
//         id: 1,
//         name: "John Doe",
//         service: "Plumbing",
//         rating: 4.8,
//         image: "/assets/images/provider1.jpg",
//       },
//       {
//         id: 2,
//         name: "Jane Smith",
//         service: "Electrical",
//         rating: 4.9,
//         image: "/assets/images/provider2.jpg",
//       },
//     ],
//   });

//   if (isLoading) return <div className="text-center py-16">Loading...</div>;

//   return (
//     <section className="py-16 bg-white">
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-bold text-center mb-8">Top Providers</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {providers.map((provider, index) => (
//             <motion.div
//               key={provider.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//             >
//               <Card
//                 title={provider.name}
//                 description={`${provider.service} • ${provider.rating} ★`}
//                 image={provider.image}
//                 action={{
//                   children: "Book Now",
//                   href: `/providers/${provider.id}`,
//                 }}
//               />
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TopProviders;

import { motion } from "framer-motion";
import Card from "../../components/common/Card";

const providers = [
  {
    id: 1,
    name: "John Doe",
    service: "Plumbing",
    rating: 4.8,
    image: "/assets/images/provider1.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    service: "Electrical",
    rating: 4.9,
    image: "/assets/images/provider2.jpg",
  },
  {
    id: 3,
    name: "Emily Johnson",
    service: "Cleaning",
    rating: 4.7,
    image: "/assets/images/defaultBG.jpg",
  },
];

const TopProviders = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Top Providers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {providers.map((provider, index) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              title={provider.name}
              description={`${provider.service} • ${provider.rating} ★`}
              image={provider.image}
              action={{
                children: "Book Now",
                href: `/providers/${provider.id}`,
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TopProviders;
