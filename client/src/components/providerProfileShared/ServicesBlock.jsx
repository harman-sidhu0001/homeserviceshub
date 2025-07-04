import { LuCircleCheckBig } from "react-icons/lu";
const ServicesBlock = ({ services }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <div className="text-xl font-semibold mb-4">Services We Offer</div>
    {services && services.length ? (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="flex items-center bg-gray-100 rounded-lg p-3"
          >
            <LuCircleCheckBig className="text-primary mr-2" />
            <span>{service}</span>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-gray-400">No services listed.</div>
    )}
  </div>
);
export default ServicesBlock;
