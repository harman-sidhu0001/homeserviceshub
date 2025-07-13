import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getProviderById } from "../model/provider";
import { createReview } from "../model/review";

const ReviewPageViewModel = () => {
  const { id: providerId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id || user?.id;
  const navigate = useNavigate();
  const [stars, setStars] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewDescription, setReviewDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchProviderServices = async () => {
      try {
        const res = await getProviderById(providerId);
        setServices(res.data?.providerProfile?.services || []);
      } catch (err) {
        setServices([]);
      }
    };
    if (providerId) fetchProviderServices();
  }, [providerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createReview({
        reviewBy: userId,
        reviewTo: providerId,
        stars,
        reviewTitle,
        reviewDescription,
      });
      navigate(`/provider/${providerId}`); // Redirect to provider profile page
    } catch (err) {
      setError("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};

export default ReviewPageViewModel;
