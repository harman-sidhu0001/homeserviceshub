import { useState } from "react";
import { useSelector } from "react-redux";
import CustomButton from "../common/Button";
import Modal from "../common/Modal";

const ProfileHeader = ({
  profilePhoto,
  companyName,
  location,
  totalReviews,
  onWriteReview,
  onRequestService,
  onBookmark,
  isBookmarked,
  isProvider,
}) => {
  const user = useSelector((state) => state.auth.user);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Helper to handle button clicks
  const handleAction = (handler) => {
    // If not logged in or is a provider, show modal
    if (!user || user.accountType === "provider") {
      setModalMessage("You need to login as a user to use this feature.");
      setModalOpen(true);
    } else if (typeof handler === "function") {
      handler();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow flex flex-col md:flex-row items-center p-6 gap-6 mt-6">
      <img
        src={
          profilePhoto
            ? profilePhoto
            : "/assets/icons/default-profile-picture.svg"
        }
        alt="Profile"
        className="w-32 h-32 rounded-xl object-cover object-top border-2 border-primary"
      />
      <div className="flex-1 flex flex-col items-center md:items-start">
        <div className="text-2xl font-bold">{companyName}</div>
        <div className="text-accent">{location}</div>
        <div className="text-gray-500 text-sm">({totalReviews}) Reviews</div>
      </div>
      <div className="flex flex-col gap-2 w-full md:w-auto">
        {isProvider ? (
          <>
            <CustomButton
              text="Edit Profile"
              onClick={() => handleAction(onWriteReview)}
            />
            <CustomButton
              text="See Plans"
              onClick={() => handleAction(onRequestService)}
            />
          </>
        ) : (
          <>
            <CustomButton
              text="Write a Review"
              onClick={() => handleAction(onWriteReview)}
            />
            <CustomButton
              text="Request a Service"
              onClick={() => handleAction(onRequestService)}
            />
            <CustomButton
              text={isBookmarked ? "Remove from bookmark" : "Add to bookmark"}
              onClick={() => handleAction(onBookmark)}
            />
          </>
        )}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-6 text-center">
          <div className="text-lg font-semibold mb-2">{modalMessage}</div>
          <button
            className="mt-4 px-4 py-2 bg-primary text-white rounded"
            onClick={() => setModalOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileHeader;
