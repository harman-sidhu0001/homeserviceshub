import React from "react";
import { FaStar, FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";
import { GoVerified } from "react-icons/go";
import CustomButton from "../common/Button";

const ProviderCard = ({ provider }) => {
  const {
    companyName,
    location,
    rating = 0,
    projectsCompleted = 0,
    profilePhoto = "/assets/images/defaultBG.jpg",
    about = "We are a dedicated team of professionals providing top-notch services to meet your needs.",
    isVerified = true,
    services = [],
  } = provider.providerProfile;

  const handleReadMore = () => {
    console.log(`Read more clicked for ${companyName}`);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col sm:flex-row justify-between gap-4">
      {/* Block 1: All info except buttons */}
      <div className="flex-grow flex flex-col gap-4">
        {/* Top: Image + Basic Info (row) */}
        <div className="flex gap-4">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <img
              src={profilePhoto}
              alt={`${companyName} profile`}
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>

          {/* Main Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{companyName}</h3>

              {isVerified && (
                <span className="inline-flex items-center text-sm text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full mt-1">
                  <GoVerified className="mr-1" /> Verified
                </span>
              )}

              <p className="text-sm text-gray-500 flex items-center mt-2">
                <FaMapMarkerAlt className="mr-2 text-gray-400" />
                {location}
              </p>
            </div>

            <div className="flex items-center text-sm text-gray-600 mt-2 gap-4">
              <span className="flex items-center" title="Rating">
                <FaStar className="text-yellow-400 mr-1" /> {rating?.toFixed(1)}
              </span>
              <span className="flex items-center" title="Experience">
                <FaBriefcase className="text-blue-500 mr-1" />{" "}
                {projectsCompleted} Projects
              </span>
            </div>
          </div>
        </div>

        {/* Bottom: About and Services */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex gap-2">
            <p className="text-gray-700 text-sm line-clamp-2">{about}</p>
            <button
              onClick={handleReadMore}
              className="text-primary text-sm font-semibold hover:underline w-fit"
            >
              read more
            </button>
          </div>

          {services.length > 0 && (
            <div className="text-sm text-gray-600 mt-2">
              <strong>Services:</strong> {services.join(", ")}
            </div>
          )}
        </div>
      </div>

      {/* Block 2: Action Buttons (in column) */}
      <div className="flex flex-col gap-2 justify-center items-center sm:items-end">
        <CustomButton
          text={"Request a Service"}
          height={"auto"}
          width={"100%"}
        />
        <CustomButton text={"Profile"} height={"auto"} width={"100%"} />
      </div>
    </div>
  );
};

export default ProviderCard;
