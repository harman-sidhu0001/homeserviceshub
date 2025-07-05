import React, { useState, useEffect } from "react";
import { FiCalendar } from "react-icons/fi";

const AvailabilitySelector = ({
  value = [],
  onChange,
  className = "",
  disabled = false,
  label = "Availability",
  required = false,
}) => {
  const [selectedDays, setSelectedDays] = useState(value);

  const days = [
    { key: "M", label: "Mon", fullName: "Monday" },
    { key: "T", label: "Tue", fullName: "Tuesday" },
    { key: "W", label: "Wed", fullName: "Wednesday" },
    { key: "T", label: "Thu", fullName: "Thursday" },
    { key: "F", label: "Fri", fullName: "Friday" },
    { key: "S", label: "Sat", fullName: "Saturday" },
    { key: "S", label: "Sun", fullName: "Sunday" },
  ];

  useEffect(() => {
    setSelectedDays(value);
  }, [value]);

  const handleDayClick = (dayKey, dayIndex) => {
    if (disabled) return;

    // Map display letters to full day names for storage
    const dayMapping = {
      M: "Mon",
      T: dayIndex === 1 ? "Tue" : "Thu", // Tuesday vs Thursday
      W: "Wed",
      F: "Fri",
      S: dayIndex === 5 ? "Sat" : "Sun", // Saturday vs Sunday
    };

    const fullDayName = dayMapping[dayKey];

    const newSelectedDays = selectedDays.includes(fullDayName)
      ? selectedDays.filter((day) => day !== fullDayName)
      : [...selectedDays, fullDayName];

    setSelectedDays(newSelectedDays);
    onChange?.(newSelectedDays);
  };

  const isDaySelected = (dayKey, dayIndex) => {
    // Map display letters to full day names
    const dayMapping = {
      M: "Mon",
      T: dayIndex === 1 ? "Tue" : "Thu", // Tuesday vs Thursday
      W: "Wed",
      F: "Fri",
      S: dayIndex === 5 ? "Sat" : "Sun", // Saturday vs Sunday
    };

    const fullDayName = dayMapping[dayKey];
    return selectedDays.includes(fullDayName);
  };

  const getDayDisplayKey = (dayKey, dayIndex) => {
    if (dayKey === "T") {
      return dayIndex === 1 ? "T" : "T"; // Both show as T but different keys
    } else if (dayKey === "S") {
      return dayIndex === 5 ? "S" : "S"; // Both show as S but different keys
    }
    return dayKey;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <FiCalendar className="w-5 h-5 text-gray-600" />
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      <div className="flex space-x-2">
        {days.map((day, index) => {
          const isSelected = isDaySelected(day.key, index);
          const displayKey = getDayDisplayKey(day.key, index);

          return (
            <button
              key={`${day.key}-${index}`}
              type="button"
              onClick={() => handleDayClick(day.key, index)}
              disabled={disabled}
              className={`
                w-12 h-12 rounded-lg border-2 font-semibold text-sm transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2
                ${
                  isSelected
                    ? "bg-primary border-primary text-white shadow-md "
                    : "bg-gray-50 border-gray-300 text-gray-500 hover:border-gray-400 hover:bg-gray-100"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
              title={day.fullName}
            >
              {displayKey}
            </button>
          );
        })}
      </div>

      {selectedDays.length > 0 && (
        <div className="text-xs text-gray-600">
          Available: {selectedDays.length} day
          {selectedDays.length !== 1 ? "s" : ""}
        </div>
      )}

      {selectedDays.length === 0 && required && (
        <div className="text-xs text-red-500">
          Please select at least one day
        </div>
      )}
    </div>
  );
};

export default AvailabilitySelector;
