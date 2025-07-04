import { BsStarFill, BsStar, BsStarHalf } from "react-icons/bs";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useState } from "react";

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  return (
    <span className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) =>
        i < fullStars ? (
          <BsStarFill key={i} className="text-yellow-400 text-lg" />
        ) : i === fullStars && hasHalfStar ? (
          <BsStarHalf key={i} className="text-yellow-400 text-lg" />
        ) : (
          <BsStar key={i} className="text-yellow-400 text-lg" />
        )
      )}
    </span>
  );
};

const Tooltip = ({ text, children }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex={0}
    >
      {children}
      {show && (
        <span className="absolute z-20 left-1/2 -translate-x-1/2 top-full mt-2 w-max max-w-xs bg-black text-white text-xs rounded px-2 py-1 shadow-lg whitespace-pre-line">
          {text}
        </span>
      )}
    </span>
  );
};

const stats = [
  {
    label: "Reviews",
    valueKey: "avgRating",
    render: renderStars,
    tooltip: "Stars on the basis of all reviews given by users.",
  },
  {
    label: "Reputation",
    valueKey: "reputation",
    render: renderStars,
    tooltip: "Stars on the basis of acceptance rate of projects.",
  },
  {
    label: "Response",
    valueKey: "responsiveness",
    render: renderStars,
    tooltip: "Stars are awarded based on time taken for reply.",
  },
  {
    label: "Availability",
    valueKey: "availability",
    render: (v) => <span className="font-bold text-black">{v || "N/A"}</span>,
    tooltip: "The working days of the company.",
  },
  {
    label: "Projects Done",
    valueKey: "projectsDone",
    render: (v) => <span className="font-bold text-black">{v ?? "N/A"}</span>,
    tooltip: "The total number of projects done by company.",
  },
  {
    label: "Project Ongoing",
    valueKey: "projectsOngoing",
    render: (v) => <span className="font-bold text-black">{v ?? "N/A"}</span>,
    tooltip: "The total number of ongoing projects.",
  },
];

const RatingsBlock = (props) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6 flex flex-col md:flex-row items-center md:items-stretch gap-4 md:gap-6">
      {/* Left: Big star and overall rating */}
      <div className="flex flex-col items-center justify-center md:items-start md:justify-start min-w-[90px] md:min-w-[120px]">
        <div className="flex items-center gap-2">
          <BsStarFill className="text-yellow-400 text-4xl md:text-5xl" />
          <div className="ml-2">
            <div className="text-3xl md:text-5xl font-bold text-black leading-none">
              {props.overallRating
                ? `${Math.floor(props.overallRating)}/5`
                : "N/A"}
            </div>
            <div className="text-base font-semibold text-black mt-1">
              Overall Ratings
            </div>
          </div>
        </div>
      </div>
      {/* Right: Stats grid */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 w-full">
        {stats.map(({ label, valueKey, render, tooltip }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="font-semibold text-green-900">{label}</span>
            <Tooltip text={tooltip}>
              <AiOutlineInfoCircle className="inline ml-1 text-green-900 cursor-pointer" />
            </Tooltip>
            <span className="ml-auto">{render(props[valueKey])}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingsBlock;
