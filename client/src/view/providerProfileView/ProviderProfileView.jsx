import { useMemo } from "react";
import { useProviderProfileViewModel } from "../../viewModel/providerProfileViewModel";
import ProfileHeader from "../../components/providerProfileShared/ProfileHeader";
import ProfileTabs from "../../components/providerProfileShared/ProfileTabs";
import RatingsBlock from "../../components/providerProfileShared/RatingsBlock";
import ServicesBlock from "../../components/providerProfileShared/ServicesBlock";
import ReviewsBlock from "../../components/providerProfileShared/ReviewsBlock";
import GalleryBlock from "../../components/providerProfileShared/GalleryBlock";
import LoginModal from "../../components/models/LoginModal";

const InfoCard = ({ title, value }) => (
  <div className="bg-gray-100 rounded-lg p-4">
    <div className="font-semibold text-primary">{title}</div>
    <div>{value ?? "N/A"}</div>
  </div>
);

const detailsFields = [
  { key: "serviceAreas", label: "Areas Served", render: (v) => v?.join(", ") },
  { key: "yearOfEstablishment", label: "Year of Established" },
  { key: "paymentMethod", label: "Payment method" },
  { key: "totalWorkers", label: "Number of workers" },
  {
    key: "writtenContract",
    label: "Written Contract",
    render: (v) => (v === true ? "Yes" : v === false ? "No" : "N/A"),
  },
];

const OtherDetailsBlock = ({ details }) => (
  <div className="bg-white rounded-xl shadow p-6 mt-6">
    <div className="text-xl font-semibold mb-4">Other Details</div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {detailsFields.map(({ key, label, render }) => (
        <InfoCard
          key={key}
          title={label}
          value={render ? render(details[key]) : details[key]}
        />
      ))}
    </div>
  </div>
);

const AwardsBlock = ({ awards, className }) => (
  <div
    className={`bg-white rounded-xl shadow p-6 flex flex-col items-center ${className}`}
  >
    <div className="text-xl font-semibold mb-4">Awards</div>
    {awards?.length ? (
      <ul className="list-disc pl-5 text-gray-700 w-full">
        {awards.map((award, idx) => (
          <li key={idx}>{award}</li>
        ))}
      </ul>
    ) : (
      <div className="text-gray-400">No awards listed.</div>
    )}
  </div>
);

const ProviderProfileView = () => {
  const vm = useProviderProfileViewModel();
  const details = useMemo(() => vm.detailsProps, [vm.detailsProps]);

  if (vm.loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="text-lg text-primary">
          Loading provider profile...
        </span>
      </div>
    );
  if (vm.error)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="text-lg text-red-500">{vm.error}</span>
      </div>
    );
  if (!vm.provider)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="text-lg text-gray-500">Provider not found.</span>
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <div className="max-w-6xl mx-auto px-2 md:px-6">
        <ProfileHeader {...vm.headerProps} />
        <ProfileTabs selected={vm.selectedTab} onSelect={vm.setSelectedTab} />
        <div className="mt-6">
          {vm.selectedTab === "overview" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 flex flex-col gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="text-lg font-semibold mb-2 text-primary">
                      About
                    </div>
                    <div className="text-gray-700 whitespace-pre-line">
                      {vm.provider.intro}
                    </div>
                  </div>
                  <RatingsBlock {...vm.ratingsProps} />
                </div>
                <AwardsBlock
                  awards={vm.provider.awards}
                  className="md:h-full"
                />
              </div>
              <div className="mt-6">
                <ServicesBlock services={vm.provider.services} />
                <OtherDetailsBlock details={details} />
              </div>
            </>
          )}
          {vm.selectedTab === "reviews" && (
            <ReviewsBlock {...vm.reviewsProps} />
          )}
          {vm.selectedTab === "gallery" && (
            <GalleryBlock {...vm.galleryProps} />
          )}
        </div>
      </div>
      <LoginModal
        show={vm.loginModal}
        onHide={vm.closeLoginModal}
        handleLogin={vm.handleLogin}
      />
    </div>
  );
};

export default ProviderProfileView;
