import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedProvider } from "../redux/slices/providerSlice";
import {
  getProviderById,
  getProviderProfile,
  getProviderServiceRequests,
  updateServiceRequestStatus,
  getProviderAnalytics,
  uploadProviderProfilePhoto,
  uploadGalleryImage,
  updateProviderProfile,
} from "../model/provider";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { BsStarFill, BsStar, BsStarHalf } from "react-icons/bs";
import { LuCircleCheckBig } from "react-icons/lu";
import { createDataFetcher, createUploadHandler } from "../utils/apiHandler";
import { deleteGalleryImage } from "../services/providerAPI";
import { apiCall } from "../utils/apiHandler";

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

    const fetchProvider = createDataFetcher(
      getProviderProfile,
      setLoading,
      setError,
      (data) => {
        setProvider(data);
        dispatch(setSelectedProvider(data));
      }
    );

    fetchProvider(id);
  }, [id, selectedProvider, isSameProvider, dispatch]);

  return { provider, loading, error };
};

export const useProviderProfileViewModel = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [refreshAfterReview, setRefreshAfterReview] = useState(false);

  // Detect if redirected from review submission
  useEffect(() => {
    if (location.state && location.state.refreshAfterReview) {
      setRefreshAfterReview(true);
      setSelectedTab("reviews");
    }
  }, [location.state]);

  // Fetch provider profile on mount or after review submission
  useEffect(() => {
    if (id && (provider === null || refreshAfterReview)) {
      const fetchProviderData = createDataFetcher(
        getProviderProfile,
        setLoading,
        setError,
        (data) => {
          setProvider(data);
          setRefreshAfterReview(false);
        }
      );
      fetchProviderData(id);
    }
  }, [id, provider, refreshAfterReview]);

  const fetchAnalytics = createDataFetcher(
    getProviderAnalytics,
    setLoading,
    setError,
    setAnalytics
  );

  // Create centralized upload handlers
  const handleProfilePhotoUpload = createUploadHandler(
    uploadProviderProfilePhoto,
    setUploadLoading,
    (data) => {
      setProvider((prev) => ({
        ...prev,
        profilePhoto: data.profilePhoto,
      }));
    }
  );

  const handleGalleryUpload = createUploadHandler(
    uploadGalleryImage,
    setUploadLoading,
    (data) => {
      setProvider((prev) => ({
        ...prev,
        gallery: data.gallery,
      }));
    },
    "galleryImage" // Pass correct field name for gallery upload
  );

  // Handle service request status update
  const handleUpdateRequestStatus = async (
    requestId,
    status,
    responseMessage = ""
  ) => {
    const result = await createDataFetcher(
      updateServiceRequestStatus,
      setLoading,
      setError,
      () => fetchProviderProfile() // Refresh provider profile to get updated stats
    )(requestId, { status, responseMessage });

    return result;
  };

  // Expose a method to refetch provider profile
  const fetchProviderProfile = async () => {
    await createDataFetcher(
      getProviderProfile,
      setLoading,
      setError,
      setProvider
    )(id);
  };

  // Expose updateProviderProfile for verification request
  const updateProviderProfileHandler = async (providerId, data) => {
    await updateProviderProfile(providerId, data);
  };

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
    profilePhoto: provider?.data.profilePhoto,
    companyName: provider?.data.companyName,
    location: provider?.data.location,
    totalReviews: provider?.data.totalReviews,
    onWriteReview,
    onRequestService,
    onBookmark,
    isBookmarked,
  };

  // Ratings block
  const ratingsProps = {
    overallRating: provider?.data.overallRating,
    avgRating: provider?.data.avgReviewRating,
    reputation: provider?.data.overallRating,
    responsiveness: provider?.data.avgResponseTime,
    availability: provider?.data.availability,
    projectsDone: provider?.data.projectsDone,
    projectsOngoing: provider?.data.projectsOngoing,
  };

  // Reviews block (map review fields for ReviewsBlock)
  const reviewsProps = {
    reviews: (provider?.data?.reviews || []).map((review) => ({
      id: review._id,
      service: review.reviewTitle,
      stars: review.stars,
      date: review.date ? new Date(review.date).toLocaleDateString() : "",
      description: review.reviewDescription,
      reviewBy: review.reviewBy, // pass reviewBy for profile photo and name
    })),
    loading,
  };

  // Details block
  const detailsProps = {
    serviceAreas: provider?.data.serviceAreas,
    yearOfEstablishment: provider?.data.yearOfEstablishment,
    paymentMethod: provider?.data.paymentMethods,
    totalWorkers: provider?.data.totalWorkers,
    writtenContract: provider?.data.writtenContract,
  };

  // Gallery block
  const galleryProps = {
    media: provider?.data.gallery || [],
  };

  // Service requests from profile data
  const serviceRequests = provider?.data?.recentRequests || [];

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
    setLoginModal,
    closeLoginModal,
    handleLogin,
    serviceRequests,
    analytics,
    uploadLoading,
    fetchAnalytics: (period = "30") => fetchAnalytics(id, { period }),
    handleUpdateRequestStatus,
    handleProfilePhotoUpload,
    handleGalleryUpload,
    fetchProviderProfile, // Expose for refresh after upload
    updateProviderProfile: updateProviderProfileHandler, // Expose for verification
  };
};

// For logged-in provider profile (no id in params)
export const useLoggedProviderProfileViewModel = () => {
  const user = useSelector((state) => state.auth.user);
  const id = user?._id || user?.id;
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchProviderData = createDataFetcher(
        getProviderProfile,
        setLoading,
        setError,
        setProvider
      );
      fetchProviderData(id);
    }
  }, [id]);

  const fetchAnalytics = createDataFetcher(
    getProviderAnalytics,
    setLoading,
    setError,
    setAnalytics
  );

  // Create centralized upload handlers
  const handleProfilePhotoUpload = createUploadHandler(
    uploadProviderProfilePhoto,
    setUploadLoading,
    (data) => {
      setProvider((prev) => ({
        ...prev,
        profilePhoto: data.profilePhoto,
      }));
    }
  );

  const handleGalleryUpload = createUploadHandler(
    uploadGalleryImage,
    setUploadLoading,
    (data) => {
      setProvider((prev) => ({
        ...prev,
        gallery: data.gallery,
      }));
    },
    "galleryImage" // Pass correct field name for gallery upload
  );

  // Add handler for deleting gallery images
  const handleGalleryDelete = async (imageUrl) => {
    setUploadLoading(true);
    try {
      await apiCall(deleteGalleryImage, imageUrl);
      await fetchProviderProfile();
    } catch (error) {
      setError(error.message);
    } finally {
      setUploadLoading(false);
    }
  };

  // Handle service request status update
  const handleUpdateRequestStatus = async (
    requestId,
    status,
    responseMessage = ""
  ) => {
    const result = await createDataFetcher(
      updateServiceRequestStatus,
      setLoading,
      setError,
      () => fetchProviderProfile() // Refresh provider profile to get updated stats
    )(requestId, { status, responseMessage });

    return result;
  };

  // Expose a method to refetch provider profile
  const fetchProviderProfile = async () => {
    await createDataFetcher(
      getProviderProfile,
      setLoading,
      setError,
      setProvider
    )(id);
  };

  // Expose updateProviderProfile for verification request
  const updateProviderProfileHandler = async (providerId, data) => {
    await updateProviderProfile(providerId, data);
  };

  // Handlers
  const onWriteReview = () => setLoginModal(true);
  const onRequestService = () => setLoginModal(true);
  const onBookmark = () => setIsBookmarked((prev) => !prev);
  const closeLoginModal = () => setLoginModal(false);
  const handleLogin = () => navigate("/register");

  // Props for header
  const headerProps = {
    profilePhoto: provider?.data.profilePhoto,
    companyName: provider?.data.companyName,
    location: provider?.data.location,
    totalReviews: provider?.data.totalReviews,
    onWriteReview,
    onRequestService,
    onBookmark,
    isBookmarked,
  };

  // Ratings block
  const ratingsProps = {
    overallRating: provider?.data.overallRating,
    avgRating: provider?.data.avgReviewRating,
    reputation: provider?.data.overallRating,
    responsiveness: provider?.data.avgResponseTime,
    availability: provider?.data.availability,
    projectsDone: provider?.data.projectsDone,
    projectsOngoing: provider?.data.projectsOngoing,
  };

  // Reviews block
  const reviewsProps = {
    reviews: provider?.data.recentRequests || [],
    loading,
  };

  // Details block
  const detailsProps = {
    serviceAreas: provider?.data.serviceAreas,
    yearOfEstablishment: provider?.data.yearOfEstablishment,
    paymentMethod: provider?.data.paymentMethods,
    totalWorkers: provider?.data.totalWorkers,
    writtenContract: provider?.data.writtenContract,
  };

  // Gallery block
  const galleryProps = {
    media: provider?.data.gallery || [],
  };

  // Service requests from profile data
  const serviceRequests = provider?.data?.recentRequests || [];

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
    setLoginModal,
    closeLoginModal,
    handleLogin,
    serviceRequests,
    analytics,
    uploadLoading,
    fetchServiceRequests: () => fetchServiceRequests(id),
    fetchAnalytics: (period = "30") => fetchAnalytics(id, { period }),
    handleUpdateRequestStatus,
    handleProfilePhotoUpload,
    handleGalleryUpload,
    handleGalleryDelete,
    fetchProviderProfile, // Expose for refresh after upload
    updateProviderProfile: updateProviderProfileHandler, // Expose for verification
  };
};
