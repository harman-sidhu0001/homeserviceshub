import React from "react";
import { FaStar, FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";
import { GoVerified } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "../common/Button";
// Removed AvailabilityDisplay import since we're using inline spans now
import { useDispatch } from "react-redux";
import { setSelectedProvider } from "../../redux/slices/providerSlice";

const ProviderCard = ({ provider, onServiceClick }) => {
  const {
    companyName,
    location,
    rating = 0,
    projectsCompleted = 0,
    profilePhoto,
    about = "We are a dedicated team of professionals providing top-notch services to meet your needs.",
    isVerified = true,
    services = [],
    availability = [],
  } = provider.providerProfile;
  console.log(profilePhoto, "profilePhoto in ProviderCard");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    dispatch(setSelectedProvider(provider));
    navigate(`/provider/${provider._id}`);
  };

  const handleCardClick = (e) => {
    // Prevent scroll-to-top if a button or link inside the card was clicked
    if (e.target.closest("button") || e.target.closest("a")) {
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-full cursor-default bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-xl hover:border-primary transition-all duration-300 flex flex-col sm:flex-row justify-between gap-4"
    >
      {/* Block 1: All info except buttons */}
      <div className="flex-grow flex flex-col gap-4">
        {/* Top: Image + Basic Info (row) */}
        <div className="flex gap-4">
          {/* Profile Photo */}
          <Link to={`/provider/${provider._id}`}>
            <div className="flex-shrink-0">
              <img
                src={
                  profilePhoto ? profilePhoto : "/assets/images/defaultBG.jpg"
                }
                alt={`${companyName} profile`}
                className="w-24 h-24 rounded-full cursor-pointer object-cover"
              />
            </div>
          </Link>
          {/* Main Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 cursor-pointer">
                <Link to={`/provider/${provider._id}`}>{companyName}</Link>
              </h3>

              {isVerified && (
                <span className="inline-flex items-center cursor-pointer text-sm text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full mt-1">
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
            <Link
              to={`/provider/${provider._id}`}
              className="text-primary text-sm font-semibold cursor-pointer hover:underline w-fit"
            >
              read more
            </Link>
            {/* <button
              onClick={handleReadMore}
              className="text-primary text-sm font-semibold cursor-pointer hover:underline w-fit"
            >
              read more
            </button> */}
          </div>

          {services.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600 mt-2">
              <strong className="self-center">Services:</strong>
              {services.map((service) => (
                <span
                  key={service}
                  onClick={() => onServiceClick && onServiceClick(service)}
                  className="bg-gray-100 text-gray-700 cursor-pointer px-2.5 py-1 rounded-full text-xs hover:bg-primary hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-light"
                  title={`Search for ${service}`}
                >
                  {service}
                </span>
              ))}
            </div>
          )}

          {/* Availability Display */}
          {availability && availability.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-600 font-medium">
                Available:
              </span>
              <div className="flex space-x-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => {
                  // Map display letters to full day names
                  const dayMapping = {
                    M: "Mon",
                    T: index === 1 ? "Tue" : "Thu", // Tuesday vs Thursday
                    W: "Wed",
                    F: "Fri",
                    S: index === 5 ? "Sat" : "Sun", // Saturday vs Sunday
                  };

                  const fullDayName = dayMapping[day];
                  const isAvailable = availability.includes(fullDayName);
                  return (
                    <span
                      key={`${day}-${index}`}
                      className={`
                        font-bold text-xs
                        ${isAvailable ? "text-primary" : "text-gray-300"}
                      `}
                      title={`${day}: ${
                        isAvailable ? "Available" : "Not Available"
                      }`}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
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
        <CustomButton
          onClick={handleProfileClick}
          text={"Profile"}
          height={"auto"}
          width={"100%"}
        />
      </div>
    </div>
  );
};

export default ProviderCard;
