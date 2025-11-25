import { useEffect, useMemo, useState } from "react";
import { useProviderProfileViewModel } from "../../viewModel/providerProfileViewModel";
import ProfileHeader from "../../components/providerProfileShared/ProfileHeader";
import ProfileTabs from "../../components/providerProfileShared/ProfileTabs";
import RatingsBlock from "../../components/providerProfileShared/RatingsBlock";
import ServicesBlock from "../../components/providerProfileShared/ServicesBlock";
import ReviewsBlock from "../../components/providerProfileShared/ReviewsBlock";
import GalleryBlock from "../../components/providerProfileShared/GalleryBlock";
import LoginModal from "../../components/models/LoginModal";
import useAuth from "../../hooks/useAuth";
import { axiosClient } from "../../utils/axiosClient";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const InfoCard = ({ title, value }) => (
  <div className="bg-gray-100 rounded-lg p-4">
    <div className="font-semibold text-primary">{title}</div>
    <div>{value ?? "N/A"}</div>
  </div>
);

const detailsFields = [
  { key: "yearOfEstablishment", label: "Year of Established" },
  { key: "paymentMethod", label: "Payment method" },
  { key: "totalWorkers", label: "Number of workers" },
  { key: "serviceAreas", label: "Areas Served", render: (v) => v?.join(", ") },
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
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const [uploading, setUploading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const details = useMemo(() => vm.detailsProps, [vm.detailsProps]);

  // Check if the provider is bookmarked on mount
  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      try {
        const res = await axiosClient.get(
          `/bookmarks/check?providerId=${routeId}`
        );
        setIsBookmarked(res.data.bookmarked);
      } catch (err) {
        setIsBookmarked(false);
      }
    };
    if (routeId) fetchBookmarkStatus();
  }, [routeId]);

  // Handler for write review navigation
  const handleWriteReview = () => {
    navigate(`/provider/${routeId}/review`);
  };

  // Handler for request service navigation
  const handleRequestService = () => {
    navigate(`/request-service/${routeId}`);
  };

  // Handler for add/remove bookmark
  const handleBookmark = async () => {
    setBookmarkLoading(true);
    try {
      if (!isBookmarked) {
        await axiosClient.post("/bookmarks/add", { providerId: routeId });
        setIsBookmarked(true);
      } else {
        await axiosClient.post("/bookmarks/remove", { providerId: routeId });
        setIsBookmarked(false);
      }
    } catch (err) {
      // Optionally show error
    } finally {
      setBookmarkLoading(false);
    }
  };

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
  if (!vm.provider.data)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="text-lg text-gray-500">Provider not found.</span>
      </div>
    );
  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <div className="max-w-6xl mx-auto px-2 md:px-6">
        <ProfileHeader
          {...vm.headerProps}
          onWriteReview={handleWriteReview}
          onRequestService={handleRequestService}
          onBookmark={handleBookmark}
          isBookmarked={isBookmarked}
          bookmarkLoading={bookmarkLoading}
          verificationStatus={vm.provider?.data?.verification?.status}
          // No edit or plans for public view
        />
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
                      {vm.provider.data.intro}
                    </div>
                  </div>
                  <RatingsBlock {...vm.ratingsProps} />
                </div>
                <AwardsBlock
                  awards={vm.provider.data.awards}
                  className="md:h-full"
                />
              </div>
              <div className="mt-6">
                <ServicesBlock services={vm.provider.data.services} />
                <OtherDetailsBlock details={details} />
              </div>
            </>
          )}

          {vm.selectedTab === "reviews" && (
            <ReviewsBlock {...vm.reviewsProps} />
          )}
          {vm.selectedTab === "gallery" && (
            <GalleryBlock
              media={vm.galleryProps.media}
              // No add/delete/upload for public view
              // uploading={uploading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderProfileView;
