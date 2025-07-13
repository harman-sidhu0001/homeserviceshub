import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { BsStarFill } from "react-icons/bs";
import CustomButton from "../components/common/Button";
import ReviewPageViewModel from "../viewModel/ReviewPageViewModel";

const ReviewPage = () => {
  const { id: providerId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id || user?.id;
  const navigate = useNavigate();
  const {
    stars,
    setStars,
    reviewTitle,
    setReviewTitle,
    reviewDescription,
    setReviewDescription,
    loading,
    error,
    handleSubmit,
    services,
  } = ReviewPageViewModel(providerId, userId);

  // For interactive star rating
  const [hoveredStar, setHoveredStar] = useState(null);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Write a Review</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Review Title Dropdown */}
        <div>
          <label className="block mb-1 font-semibold" htmlFor="reviewTitle">
            Service
          </label>
          <select
            id="reviewTitle"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            className="w-full border rounded p-2 focus:outline-primary"
            required
          >
            <option value="" disabled>
              Select a service
            </option>
            {services.map((service, idx) => (
              <option key={idx} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
        {/* Description */}
        <div>
          <label
            className="block mb-1 font-semibold"
            htmlFor="reviewDescription"
          >
            Description
          </label>
          <textarea
            id="reviewDescription"
            value={reviewDescription}
            onChange={(e) => setReviewDescription(e.target.value)}
            className="w-full border rounded p-2 focus:outline-primary"
            rows={4}
            placeholder="Share your experience..."
            required
          />
        </div>
        {/* Stars */}
        <div>
          <label className="block mb-1 font-semibold">Rating</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setStars(n)}
                onMouseEnter={() => setHoveredStar(n)}
                onMouseLeave={() => setHoveredStar(null)}
                className="focus:outline-none"
                aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
              >
                <BsStarFill
                  className={`text-3xl transition-colors duration-150 ${
                    (hoveredStar || stars) >= n
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-primary font-semibold">{stars} / 5</span>
          </div>
        </div>
        {/* Error */}
        {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
        {/* Submit Button */}
        <div className="flex justify-center">
          <CustomButton
            type="submit"
            text={loading ? "Submitting..." : "Submit Review"}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default ReviewPage;
