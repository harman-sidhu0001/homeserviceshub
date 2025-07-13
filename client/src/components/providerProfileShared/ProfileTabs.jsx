const ProfileTabs = ({ selected, onSelect, showServiceRequests = false }) => {
  const tabs = [
    { key: "overview", label: "Overview" },
    ...(showServiceRequests
      ? [{ key: "service-requests", label: "Service Requests" }]
      : []),
    { key: "reviews", label: "Reviews" },
    { key: "gallery", label: "Gallery" },
  ];

  return (
    <div className="flex bg-white rounded-t-xl rounded-b-2xl shadow mt-6 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`flex-1 py-3 px-4 text-center font-semibold transition whitespace-nowrap min-w-[100px] ${
            selected === tab.key
              ? "bg-primary text-white"
              : "text-gray-600 hover:bg-primary/10"
          }`}
          onClick={() => onSelect(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
export default ProfileTabs;
