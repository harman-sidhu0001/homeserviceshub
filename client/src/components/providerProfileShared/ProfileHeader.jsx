import CustomButton from "../common/Button";

const ProfileHeader = ({
  profilePhoto,
  companyName,
  location,
  totalReviews,
  onWriteReview,
  onRequestService,
  onBookmark,
  isBookmarked,
}) => (
  <div className="bg-white rounded-xl shadow flex flex-col md:flex-row items-center p-6 gap-6 mt-6">
    <img
      src={profilePhoto}
      alt="Profile"
      className="w-32 h-32 rounded-xl object-cover border-2 border-primary"
    />
    <div className="flex-1 flex flex-col items-center md:items-start">
      <div className="text-2xl font-bold">{companyName}</div>
      <div className="text-accent">{location}</div>
      <div className="text-gray-500 text-sm">({totalReviews}) Reviews</div>
    </div>
    <div className="flex flex-col gap-2 w-full md:w-auto">
      <CustomButton text="Write a Review" onClick={onWriteReview} />
      <CustomButton text="Request a Service" onClick={onRequestService} />
      <CustomButton
        text={isBookmarked ? "Remove from bookmark" : "Add to bookmark"}
        onClick={onBookmark}
      />
    </div>
  </div>
);

export default ProfileHeader;
