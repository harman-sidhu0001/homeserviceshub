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
    onRequestService,
    onViewProfile,
    onRemoveBookmark,
  } = useUserProfile();

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
          {projects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{
                scale: 1.01,
                boxShadow: "0 8px 32px rgba(45,90,69,0.10)",
              }}
              className="border border-accent/20 rounded-xl p-4 md:p-6 bg-gradient-to-br from-white to-primary/5 flex flex-col md:flex-row md:justify-between md:items-center gap-2"
            >
              <div className="flex-1">
                <div className="font-semibold text-lg text-accent mb-1">
                  {project.name}
                </div>
                <div className="text-sm text-primary mb-1">
                  {project.location} • {project.type}
                </div>
                <div className="mb-2 text-sm text-gray-600">
                  {project.description}
                </div>
                <div className="text-xs text-gray-400 mb-1">
                  Requested: {project.requestDate}
                </div>
                {project.bookedForOther && (
                  <div className="text-xs text-accent mb-1">
                    Booked for:{" "}
                    <span className="font-semibold">{project.otherName}</span> (
                    {project.otherNumber})
                  </div>
                )}
                <div className="text-xs font-semibold text-primary">
                  Status: {project.status}
                </div>
              </div>
              <div className="text-xs text-accent md:text-right mt-2 md:mt-0 min-w-[80px]">
                {project.timing}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Reviews Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
          <span>⭐</span> My Reviews
        </h2>
        <div className="space-y-6">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              whileHover={{
                scale: 1.01,
                boxShadow: "0 8px 32px rgba(45,90,69,0.10)",
              }}
              className="border border-accent/20 rounded-xl p-4 bg-gradient-to-br from-white to-yellow-50"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-2">
                <div className="font-semibold text-accent text-lg">
                  {review.serviceName}
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < review.stars ? "text-yellow-400" : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-400 mb-1">{review.date}</div>
              <div className="text-sm text-gray-700">{review.description}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Bookmarks Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
          <span>🔖</span> Bookmarks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {bookmarks.map((bookmark) => (
            <motion.div
              key={bookmark.id}
              whileHover={{
                scale: 1.01,
                boxShadow: "0 8px 32px rgba(45,90,69,0.10)",
              }}
              className="border border-accent/20 rounded-xl p-4 flex flex-col items-center bg-gradient-to-br from-white to-primary/5"
            >
              <img
                src={bookmark.image}
                alt={bookmark.name}
                className="w-20 h-20 object-cover rounded-full mb-2 shadow-md"
              />
              <div className="font-semibold text-accent text-lg mb-1">
                {bookmark.name}
              </div>
              <div className="text-accent text-sm mb-2">
                {bookmark.service} • {bookmark.location}
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
                  onClick={() => onRemoveBookmark(bookmark)}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default UserProfileView;
