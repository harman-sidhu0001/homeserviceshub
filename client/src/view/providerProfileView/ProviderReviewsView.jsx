import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";

const ReviewCard = ({ review }) => (
  <div className="bg-white rounded-lg shadow p-6 mb-4">
    <div className="flex items-center justify-between mb-2">
      <div className="font-bold text-lg">{review.reviewTitle}</div>
      <div className="flex items-center gap-1">
        {[...Array(review.stars)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-xl">
            &#9733;
          </span>
        ))}
        {[...Array(5 - review.stars)].map((_, i) => (
          <span key={i} className="text-gray-300 text-xl">
            &#9733;
          </span>
        ))}
      </div>
    </div>
    <div className="text-gray-700 mb-2">{review.reviewDescription}</div>
    <div className="text-xs text-gray-500">
      {review.date ? new Date(review.date).toLocaleDateString() : ""}
    </div>
  </div>
);

const ProviderReviewsView = () => {
  const { id: providerId } = useParams();
  const getall = useParams();
  console.log(getall, "getall");
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(providerId, "providerId");
  useEffect(() => {
    const fetchReviewsAndServices = async () => {
      try {
        const [reviewsRes, providerRes] = await Promise.all([
          axiosClient.get(`/reviews?providerId=${providerId}`),
          axiosClient.get(`/providers/${providerId}`),
        ]);
        setReviews(reviewsRes.data || []);
        console.log(reviewsRes.data, "reviewsRes.data");
        setServices(providerRes.data?.providerProfile?.services || []);
      } catch (err) {
        setReviews([]);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    if (providerId) fetchReviewsAndServices();
  }, [providerId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <span className="text-lg text-primary">Loading reviews...</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-3xl font-bold bg-white rounded-md p-4 mb-6">
          Reviews ({reviews.length})
        </div>
        {services.length > 0 && (
          <div className="mb-6 bg-white rounded-md p-4">
            <div className="font-semibold mb-2">Services Provided:</div>
            <ul className="list-disc pl-6 text-gray-700">
              {services.map((service, idx) => (
                <li key={idx}>{service}</li>
              ))}
            </ul>
          </div>
        )}
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))
        ) : (
          <div className="bg-white rounded-md p-10 text-center text-3xl text-gray-400 font-semibold">
            No Reviews Yet!!!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderReviewsView;
