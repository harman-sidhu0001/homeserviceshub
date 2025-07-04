import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedProvider } from "../redux/slices/providerSlice";
import { handleAsync } from "../utils/handleAsync";
import { getProviderById } from "../model/provider";
import { useParams, useNavigate } from "react-router-dom";
import { BsStarFill, BsStar, BsStarHalf } from "react-icons/bs";
import { LuCircleCheckBig } from "react-icons/lu";

// Mock data structure for demonstration
const mockProvider = {
  profilePhoto: "/assets/icons/default-profile-picture.svg",
  companyName: "Harman AC Services",
  location: "Amritsar, Punjab, India",
  totalReviews: 1,
  intro:
    "With over 9 years of hands-on experience, I specialize in providing top-quality AC services, including repair, maintenance, and installation. Known for my technical expertise, attention to detail, and commitment to customer satisfaction, I ensure your air conditioning system operates at peak efficiency, delivering comfort and peace of mind all year round.",
  overallRating: 4.5,
  avgRating: 4.5,
  reputation: 4.5,
  responsiveness: 4.5,
  availability: "Mon-Sat",
  projectsDone: 1,
  projectsOngoing: 3,
  services: ["AC REPAIR (Split & Window)", "Installation", "Maintenance"],
  awards: ["Ace Award 2023"],
  serviceAreas: ["Amritsar"],
  yearOfEstablishment: 2016,
  paymentMethod: "Cash and Online",
  totalWorkers: 1,
  writtenContract: false,
  media: [],
  reviews: [
    {
      id: 1,
      service: "AC Service",
      stars: 5,
      date: "May 20th 2025, 3:27:00 pm",
      description: "Excellent Service",
    },
  ],
};

export const useProviderProfile = (id) => {
  const dispatch = useDispatch();
  const selectedProvider = useSelector(
    (state) => state.provider.selectedProvider
  );

  const isSameProvider = selectedProvider?._id === id;
  const [provider, setProvider] = useState(
    isSameProvider ? selectedProvider : null
  );
  const [loading, setLoading] = useState(!isSameProvider);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || isSameProvider) {
      setProvider(selectedProvider);
      setLoading(false);
      return;
    }

    const fetchProvider = async () => {
      setLoading(true);
      const { success, data, error } = await handleAsync(() =>
        getProviderById(id)
      );

      if (success) {
        setProvider(data);
        dispatch(setSelectedProvider(data));
        setError(null);
      } else {
        setError(error?.response?.data?.message || error.message);
      }

      setLoading(false);
    };

    fetchProvider();
  }, [id, selectedProvider, isSameProvider, dispatch]);

  return { provider, loading, error };
};

export const useProviderProfileViewModel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Replace with real data fetching logic
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loginModal, setLoginModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setProvider(mockProvider);
      setLoading(false);
    }, 500);
  }, [id]);

  // Handlers
  const onWriteReview = () => {
    // Check auth, else show modal
    setLoginModal(true);
  };
  const onRequestService = () => {
    setLoginModal(true);
  };
  const onBookmark = () => {
    setIsBookmarked((prev) => !prev);
  };
  const closeLoginModal = () => setLoginModal(false);
  const handleLogin = () => navigate("/register");

  // Props for header
  const headerProps = {
    profilePhoto: provider?.profilePhoto,
    companyName: provider?.companyName,
    location: provider?.location,
    totalReviews: provider?.totalReviews,
    onWriteReview,
    onRequestService,
    onBookmark,
    isBookmarked,
  };

  // Ratings block
  const ratingsProps = {
    overallRating: provider?.overallRating,
    avgRating: provider?.avgRating,
    reputation: provider?.reputation,
    responsiveness: provider?.responsiveness,
    availability: provider?.availability,
    projectsDone: provider?.projectsDone,
    projectsOngoing: provider?.projectsOngoing,
  };

  // Reviews block
  const reviewsProps = {
    reviews: provider?.reviews || [],
    loading,
  };

  // Details block
  const detailsProps = {
    serviceAreas: provider?.serviceAreas,
    yearOfEstablishment: provider?.yearOfEstablishment,
    paymentMethod: provider?.paymentMethod,
    totalWorkers: provider?.totalWorkers,
    writtenContract: provider?.writtenContract,
  };

  // Gallery block
  const galleryProps = {
    media: provider?.media || [],
  };

  return {
    provider,
    loading,
    error,
    selectedTab,
    setSelectedTab,
    headerProps,
    ratingsProps,
    reviewsProps,
    detailsProps,
    galleryProps,
    loginModal,
    closeLoginModal,
    handleLogin,
  };
};
