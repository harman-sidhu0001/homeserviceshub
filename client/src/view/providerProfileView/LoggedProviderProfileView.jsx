import { useMemo, useState } from "react";
import { useLoggedProviderProfileViewModel } from "../../viewModel/providerProfileViewModel";
import ProfileHeader from "../../components/providerProfileShared/ProfileHeader";
import ProfileTabs from "../../components/providerProfileShared/ProfileTabs";
import RatingsBlock from "../../components/providerProfileShared/RatingsBlock";
import ServicesBlock from "../../components/providerProfileShared/ServicesBlock";
import ReviewsBlock from "../../components/providerProfileShared/ReviewsBlock";
import GalleryBlock from "../../components/providerProfileShared/GalleryBlock";
import ServiceRequestsBlock from "../../components/providerProfileShared/ServiceRequestsBlock";
import VerificationStatus from "../../components/providerProfileShared/VerificationStatus";
import LoginModal from "../../components/models/LoginModal";
import ProviderEditProfileModal from "../../components/providerProfileShared/ProviderEditProfileModal";
import useAuth from "../../hooks/useAuth";
import { axiosClient } from "../../utils/axiosClient";
import { useNavigate } from "react-router-dom";
import { createChangeRequest } from "../../model/provider";

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

const LoggedProviderProfileView = () => {
  const vm = useLoggedProviderProfileViewModel();
  const { role } = useAuth();
  const navigate = useNavigate();
  const [editModal, setEditModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const details = useMemo(() => vm.detailsProps, [vm.detailsProps]);
  const [requestStatus, setRequestStatus] = useState(null);
  // const [requestCount, setRequestCount] = useState(10);
  let requestCount = vm?.provider?.data?.freeChangeRequests || 10;
  const [canRequest, setCanRequest] = useState(true);
  // New: Edit Profile handler
  const handleEditProfile = () => setEditModal(true);
  const handleCloseEdit = () => setEditModal(false);
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      return await handlePhotoUpload(file);
    }
  };
  const handleEditProfileSubmit = async (selectedFile, changeRequestText) => {
    try {
      await createChangeRequest(changeRequestText);
      setEditModal(false);
      // Optionally refresh profile data here
    } catch (err) {
      // Optionally show error feedback
    }
  };
  // New: See Plans handler
  const handleSeePlans = () => navigate("/provider/plans");
  const handleAddImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setUploading(true);
      try {
        await vm.handleGalleryUpload(file);
        if (typeof vm.fetchProviderProfile === "function") {
          await vm.fetchProviderProfile();
        }
      } catch (err) {
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  // Add this handler for deleting gallery images
  const handleDeleteImage = async (imageUrl) => {
    try {
      await vm.handleGalleryDelete(imageUrl);
      if (typeof vm.fetchProviderProfile === "function") {
        await vm.fetchProviderProfile();
      }
    } catch (err) {
      // Optionally show error feedback
    }
  };
  const handleRequestVerification = async () => {
    try {
      await axiosClient.post("/providers/request-verification");
      if (typeof vm.fetchProviderProfile === "function") {
        await vm.fetchProviderProfile();
      }
    } catch (err) {
      console.error("Error requesting verification:", err);
    }
  };

  const handleReRequestVerification = async () => {
    try {
      await axiosClient.post("/providers/request-verification");
      if (typeof vm.fetchProviderProfile === "function") {
        await vm.fetchProviderProfile();
      }
    } catch (err) {
      console.error("Error re-requesting verification:", err);
    }
  };

  // Provider profile photo upload handler (like user profile)
  const handleProfilePhoto = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await vm.handleProfilePhotoUpload(file);
      if (typeof vm.fetchProviderProfile === "function") {
        await vm.fetchProviderProfile();
      }
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
        {/* Verification Status */}
        <VerificationStatus
          verificationStatus={vm.provider?.data?.verification?.status}
          onRequestVerification={handleRequestVerification}
          onReRequestVerification={handleReRequestVerification}
        />
        <ProfileHeader
          {...vm.headerProps}
          onWriteReview={handleEditProfile}
          onRequestService={handleSeePlans}
          onBookmark={undefined}
          isProvider={true}
          onEditProfile={handleEditProfile}
          onSeePlans={handleSeePlans}
          verificationStatus={vm.provider?.data?.verification?.status}
        />
        <ProfileTabs
          selected={vm.selectedTab}
          onSelect={vm.setSelectedTab}
          showServiceRequests={true}
        />
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
              onAddImage={handleAddImage}
              onDeleteImage={handleDeleteImage}
              uploading={uploading}
            />
          )}
          {vm.selectedTab === "service-requests" && (
            <ServiceRequestsBlock
              requests={vm.serviceRequests}
              loading={vm.loading}
              onUpdateStatus={vm.handleUpdateRequestStatus}
              onRefresh={vm.fetchProviderProfile}
            />
          )}
        </div>
        <ProviderEditProfileModal
          open={editModal}
          onClose={handleCloseEdit}
          onSubmit={handleEditProfileSubmit} // for change request only
          profilePhoto={vm.headerProps.profilePhoto}
          handleProfilePhoto={handleProfilePhoto}
          requestStatus={requestStatus}
          onRequestChange={(changeText) =>
            handleEditProfileSubmit(null, changeText)
          } // for request
          canRequest={canRequest}
          requestCount={requestCount}
        />
      </div>
      <LoginModal
        show={vm.loginModal}
        onHide={vm.closeLoginModal}
        handleLogin={vm.handleLogin}
      />
    </div>
  );
};

export default LoggedProviderProfileView;
