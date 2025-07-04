import React, { useRef } from "react";
import { FaSpinner, FaExclamationTriangle, FaSearch } from "react-icons/fa";
import ProviderCard from "../../components/providers/ProviderCard";
import { useServiceProviders } from "../../viewModel/serviceProvidersViewModel";

const ServiceProvidersPage = () => {
  const {
    categoriesMatched,
    companiesMatched,
    loading,
    error,
    city,
    serviceName,
    activeTab,
    setActiveTab,
    searchInputValue,
    setSearchInputValue,
    cityInputValue,
    setCityInputValue,
    sortByValue,
    setSortByValue,
    updateSearch,
  } = useServiceProviders();
  const searchFormRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateSearch(searchInputValue.trim(), cityInputValue.trim(), sortByValue);
  };

  const handleServiceClick = (service) => {
    setSearchInputValue(service);
    if (searchFormRef.current) {
      searchFormRef.current.scrollIntoView({ behavior: "smooth" });
      searchFormRef.current.querySelector("input[type='text']").focus();
    }
    updateSearch(service.trim(), cityInputValue.trim(), sortByValue);
  };

  const displayTerm = searchInputValue || serviceName?.replace(/-/g, " ");
  const formattedTitle = displayTerm
    ?.split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <FaSpinner className="animate-spin text-5xl text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-red-50 text-red-600 p-4">
        <FaExclamationTriangle className="text-5xl mb-4" />
        <h2 className="text-3xl font-bold mb-2 text-center">
          Could Not Fetch Providers
        </h2>
        <p className="text-lg text-center">{error}</p>
      </div>
    );
  }

  const selectedProviders =
    activeTab === "categories" ? categoriesMatched : companiesMatched;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          {formattedTitle} Providers in{" "}
          {city.charAt(0).toUpperCase() + city.slice(1)}
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Find the best professionals for your needs.
        </p>

        {/* Filters */}
        <form
          ref={searchFormRef}
          onSubmit={handleSearchSubmit}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8 p-4 bg-white rounded-lg shadow items-center"
        >
          {/* Search Input */}
          <div className="relative md:col-span-4">
            <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search services or company name..."
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              required
              className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="hidden md:block text-center text-gray-500 font-semibold md:col-span-1">
            in
          </div>

          {/* City Input */}
          <div className="relative md:col-span-3">
            <input
              type="text"
              placeholder="City"
              value={cityInputValue}
              onChange={(e) => setCityInputValue(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-2">
            <select
              value={sortByValue}
              onChange={(e) => setSortByValue(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            >
              <option value="reviews">Sort by: Reviews</option>
              <option value="rating">Sort by: Rating</option>
              <option value="projects">Sort by: Projects</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-primary text-white font-bold p-2 rounded-md hover:bg-primary-dark transition-colors duration-300"
            >
              Search
            </button>
          </div>
        </form>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2 text-sm font-semibold border-b-2 ${
              activeTab === "categories"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500"
            }`}
          >
            Categories Matched ({categoriesMatched.length})
          </button>
          <button
            onClick={() => setActiveTab("companies")}
            className={`ml-4 px-4 py-2 text-sm font-semibold border-b-2 ${
              activeTab === "companies"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500"
            }`}
          >
            Companies Matched ({companiesMatched.length})
          </button>
        </div>

        {/* Results */}
        {selectedProviders.length > 0 ? (
          <div className="flex flex-col gap-6">
            {selectedProviders.map((provider) => (
              <ProviderCard
                key={provider._id}
                provider={provider}
                onServiceClick={handleServiceClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-700">
              No Providers Found in{" "}
              {activeTab === "categories" ? "Categories" : "Companies"}
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProvidersPage;
