import React from "react";
import * as FaIcons from "react-icons/fa";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useServices } from "../../viewModel/servicesViewModel";

const ServiceCard = ({ service }) => {
  const IconComponent = FaIcons[service.icon] || FaIcons.FaExclamationTriangle;

  return (
    <Link to={`/service?q=${encodeURIComponent(service.name)}&city=amritsar`}>
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 ease-in-out h-full">
        <div className="text-5xl text-primary mb-4">
          {IconComponent ? <IconComponent /> : <FaExclamationTriangle />}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
        <p className="text-gray-600 text-base">{service.description}</p>
      </div>
    </Link>
  );
};

const ServicesPage = () => {
  const { services, loading, error } = useServices();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <FaSpinner className="animate-spin text-5xl text-blue-600" />
        <span className="ml-4 text-2xl font-light text-gray-700">
          Loading Services...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-red-50 text-red-600">
        <FaExclamationTriangle className="text-5xl mb-4" />
        <h2 className="text-3xl font-bold mb-2">Something Went Wrong</h2>
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-4">
          All Services
        </h1>
        <p className="text-xl text-center text-gray-500 mb-16 max-w-3xl mx-auto">
          Explore the wide range of professional services offer to meet your
          needs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <ServiceCard key={service._id || service.name} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
