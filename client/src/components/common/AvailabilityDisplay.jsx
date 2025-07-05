import React from "react";
import { FiCalendar } from "react-icons/fi";

const AvailabilityDisplay = ({
  availability = [],
  className = "",
  showLabel = true,
  compact = false,
}) => {
  const days = [
    { key: "M", label: "Mon", fullName: "Monday" },
    { key: "T", label: "Tue", fullName: "Tuesday" },
    { key: "W", label: "Wed", fullName: "Wednesday" },
    { key: "T", label: "Thu", fullName: "Thursday" },
    { key: "F", label: "Fri", fullName: "Friday" },
    { key: "S", label: "Sat", fullName: "Saturday" },
    { key: "S", label: "Sun", fullName: "Sunday" },
  ];

  const isDayAvailable = (dayKey, dayIndex) => {
    // Map display letters to full day names
    const dayMapping = {
      M: "Mon",
      T: dayIndex === 1 ? "Tue" : "Thu", // Tuesday vs Thursday
      W: "Wed",
      F: "Fri",
      S: dayIndex === 5 ? "Sat" : "Sun", // Saturday vs Sunday
    };

    const fullDayName = dayMapping[dayKey];
    return availability.includes(fullDayName);
  };

  const getDayDisplayKey = (dayKey, dayIndex) => {
    if (dayKey === "T") {
      return dayIndex === 1 ? "T" : "T"; // Both show as T but different keys
    } else if (dayKey === "S") {
      return dayIndex === 5 ? "S" : "S"; // Both show as S but different keys
    }
    return dayKey;
  };

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showLabel && <FiCalendar className="w-4 h-4 text-gray-500" />}
        <div className="flex space-x-1">
          {days.map((day, index) => {
            const isAvailable = isDayAvailable(day.key, index);
            const displayKey = getDayDisplayKey(day.key, index);

            return (
              <span
                key={`${day.key}-${index}`}
                className={`
                  w-6 h-6 rounded text-xs font-medium flex items-center justify-center
                  ${
                    isAvailable
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                  }
                `}
                title={`${day.fullName}: ${
                  isAvailable ? "Available" : "Not Available"
                }`}
              >
                {displayKey}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex items-center space-x-2">
          <FiCalendar className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Availability
          </span>
        </div>
      )}

      <div className="flex space-x-1">
        {days.map((day, index) => {
          const isAvailable = isDayAvailable(day.key, index);
          const displayKey = getDayDisplayKey(day.key, index);

          return (
            <div
              key={`${day.key}-${index}`}
              className={`
                w-8 h-8 rounded-lg border-2 font-semibold text-xs flex items-center justify-center
                transition-colors duration-200
                ${
                  isAvailable
                    ? "bg-green-500 border-green-500 text-white shadow-sm"
                    : "bg-gray-100 border-gray-200 text-gray-400"
                }
              `}
              title={`${day.fullName}: ${
                isAvailable ? "Available" : "Not Available"
              }`}
            >
              {displayKey}
            </div>
          );
        })}
      </div>

      {availability.length > 0 && (
        <div className="text-xs text-gray-600">
          Available {availability.length} day
          {availability.length !== 1 ? "s" : ""} per week
        </div>
      )}
    </div>
  );
};

export default AvailabilityDisplay;
