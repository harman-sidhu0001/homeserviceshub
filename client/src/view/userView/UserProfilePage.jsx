import { motion } from "framer-motion";
import Avatar from "../../components/common/Avatar";
import FormInput from "../../components/common/FormInput";
import CustomButton from "../../components/common/Button";
import { useUserProfile } from "../../viewModel/userViewModel";

const UserProfileView = () => {
  const {
    user,
    profilePhoto,
    handlePhotoChange,
    projects,
    reviews,
    bookmarks,
    loading,
    error,
    cancellingRequests,
    onRequestService,
    onViewProfile,
    onRemoveBookmark,
    onCancelRequest,
  } = useUserProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium">Error loading profile</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-10">
      {/* Profile Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-primary/10 to-white rounded-3xl shadow-xl p-8 flex flex-col items-center relative overflow-hidden"
      >
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl z-0" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl z-0" />
        <div className="relative mb-4 z-10">
          <Avatar
            src={profilePhoto}
            alt="Profile Photo"
            className="w-28 h-28 border-4 border-primary shadow-lg object-cover object-top"
          />
          <label className="absolute bottom-2 right-2 bg-primary text-white rounded-full p-2 cursor-pointer shadow-md hover:bg-accent transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <span className="text-xs font-semibold">Edit</span>
          </label>
        </div>
        <div className="w-full flex flex-col items-center space-y-2 z-10">
          <FormInput
            value={user?.fullName}
            disabled
            className="text-center font-bold text-lg bg-white/80"
            inputClassName="text-center font-bold text-lg bg-white/80"
          />
          <FormInput
            value={user?.email}
            disabled
            className="text-center bg-white/80"
            inputClassName="text-center bg-white/80"
          />
          <FormInput
            value={user?.phone}
            disabled
            className="text-center bg-white/80"
            inputClassName="text-center bg-white/80"
          />
        </div>
      </motion.section>

      {/* Statistics Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
          <span>📊</span> My Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {projects.length}
            </div>
            <div className="text-sm text-blue-700">Service Requests</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {projects.filter((p) => p.status === "accepted").length}
            </div>
            <div className="text-sm text-green-700">Completed</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {reviews.length}
            </div>
            <div className="text-sm text-yellow-700">Reviews Given</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {bookmarks.length}
            </div>
            <div className="text-sm text-purple-700">Bookmarks</div>
          </div>
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
          <span>🗂️</span> My Projects
        </h2>
        <div className="space-y-6">
          {projects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-lg font-medium">No service requests yet</p>
              <p className="text-sm">Your service requests will appear here</p>
            </div>
          ) : (
            projects.map((project) => (
              <motion.div
                key={project._id}
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 8px 32px rgba(45,90,69,0.10)",
                }}
                className="border border-accent/20 rounded-xl p-4 md:p-6 bg-gradient-to-br from-white to-primary/5 flex flex-col md:flex-row md:justify-between md:items-center gap-2"
              >
                <div className="flex-1">
                  <div className="font-semibold text-lg text-accent mb-1">
                    {project.serviceName}
                  </div>
                  <div className="text-sm text-primary mb-1">
                    {project.location} •{" "}
                    {project.propertyType || "Not specified"}
                  </div>
                  <div className="mb-2 text-sm text-gray-600">
                    {project.description || "No description provided"}
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    Requested:{" "}
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  {project.providerId && (
                    <div className="text-xs text-accent mb-1">
                      Provider:{" "}
                      <span className="font-semibold">
                        {project.providerId.providerProfile?.companyName ||
                          "Unknown Provider"}
                      </span>
                    </div>
                  )}
                  <div className="text-xs font-semibold text-primary">
                    Status: {project.status}
                  </div>
                  {project.status === "pending" && (
                    <div className="mt-2">
                      <CustomButton
                        text={
                          cancellingRequests.has(project._id)
                            ? "Cancelling..."
                            : "Cancel Request"
                        }
                        width={"auto"}
                        onClick={() => onCancelRequest(project._id)}
                        disabled={cancellingRequests.has(project._id)}
                        customClass="bg-red-500 hover:bg-red-600 text-xs px-3 py-1 disabled:opacity-50"
                      />
                    </div>
                  )}
                </div>
                <div className="text-xs text-accent md:text-right mt-2 md:mt-0 min-w-[80px]">
                  {project.timeline || "No timeline"}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.section>

      {/* Reviews Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
          <span>⭐</span> My Reviews
        </h2>
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">⭐</div>
              <p className="text-lg font-medium">No reviews yet</p>
              <p className="text-sm">Your reviews will appear here</p>
            </div>
          ) : (
            reviews.map((review) => (
              <motion.div
                key={review.id}
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 8px 32px rgba(45,90,69,0.10)",
                }}
                className="border border-accent/20 rounded-xl p-4 bg-gradient-to-br from-white to-yellow-50 flex gap-4 items-start"
              >
                <img
                  src={review.providerPhoto}
                  alt={review.providerName}
                  className="w-16 h-16 rounded-full object-cover border border-primary"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-lg">{review.service}</div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < review.stars
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-accent mb-1">
                    {review.providerName}
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    {review.date}
                  </div>
                  <div className="text-gray-700">{review.description}</div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.section>

      {/* Bookmarks Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
          <span>🔖</span> Bookmarks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {bookmarks.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">🔖</div>
              <p className="text-lg font-medium">No bookmarks yet</p>
              <p className="text-sm">
                Your bookmarked providers will appear here
              </p>
            </div>
          ) : (
            bookmarks.map((bookmark) => (
              <motion.div
                key={bookmark._id}
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 8px 32px rgba(45,90,69,0.10)",
                }}
                className="border border-accent/20 rounded-xl p-4 flex flex-col items-center bg-gradient-to-br from-white to-primary/5"
              >
                <img
                  src={
                    bookmark.providerProfile?.profilePhoto ||
                    "/assets/icons/default-profile-picture.svg"
                  }
                  alt={bookmark.providerProfile?.companyName}
                  className="w-20 h-20 object-cover rounded-full mb-2 shadow-md"
                />
                <div className="font-semibold text-accent text-lg mb-1">
                  {bookmark.providerProfile?.companyName}
                </div>
                <div className="text-accent text-sm mb-2">
                  {bookmark.providerProfile?.location}
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  Services: {bookmark.providerProfile?.services?.length || 0}
                </div>
                <div className="flex gap-2 w-full justify-center">
                  <CustomButton
                    text="Request a Service"
                    onClick={() => onRequestService(bookmark)}
                  />
                  <CustomButton
                    text="Profile"
                    onClick={() => onViewProfile(bookmark)}
                  />
                  <CustomButton
                    text="Remove"
                    onClick={() => onRemoveBookmark(bookmark._id)}
                  />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default UserProfileView;
